<?php
/**
 * Strip '+1 ' prefix from HivePress listing phone numbers (hp_phone meta).
 *
 * USAGE
 * -----
 *   # Preview only — shows before/after, touches nothing:
 *   wp eval-file strip-phone-prefix.php -- --dry-run
 *
 *   # Apply changes:
 *   wp eval-file strip-phone-prefix.php
 *
 * The script only modifies rows whose hp_phone value begins with '+1 '
 * (plus-sign, digit-1, space). All other values are left untouched.
 */

// ── Safety guard: refuse to run outside WP-CLI ──────────────────────────────
if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	die( "This script must be run via WP-CLI.\n" );
}

global $wpdb;

$dry_run = in_array( '--dry-run', $args ?? [], true );   // $args is set by wp eval-file

// ── 1. Find every hp_phone meta row that starts with '+1 ' ──────────────────
$rows = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT pm.meta_id, pm.post_id, pm.meta_value, p.post_title
		 FROM {$wpdb->postmeta} pm
		 INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
		 WHERE pm.meta_key   = %s
		   AND pm.meta_value LIKE %s
		 ORDER BY pm.post_id",
		'hp_phone',
		'+1 %'       // LIKE pattern — wpdb->prepare does NOT add % automatically
	)
);

if ( empty( $rows ) ) {
	WP_CLI::success( 'No hp_phone values with a "+1 " prefix found. Nothing to do.' );
	return;
}

$total = count( $rows );

// ── 2. Always show a preview table ──────────────────────────────────────────
WP_CLI::line( '' );
WP_CLI::line( sprintf( 'Found %d listing(s) with a "+1 " prefix on hp_phone:', $total ) );
WP_CLI::line( str_repeat( '-', 72 ) );
WP_CLI::line( sprintf( '%-6s  %-28s  %-18s  %s', 'ID', 'Listing name', 'BEFORE', 'AFTER' ) );
WP_CLI::line( str_repeat( '-', 72 ) );

foreach ( $rows as $row ) {
	$before = $row->meta_value;
	$after  = preg_replace( '/^\+1 /', '', $before );
	WP_CLI::line( sprintf(
		'%-6s  %-28s  %-18s  %s',
		$row->post_id,
		mb_strimwidth( $row->post_title, 0, 28, '…' ),
		$before,
		$after
	) );
}

WP_CLI::line( str_repeat( '-', 72 ) );

// ── 3. Dry-run: stop here ────────────────────────────────────────────────────
if ( $dry_run ) {
	WP_CLI::warning( sprintf(
		'DRY RUN — no changes written. Re-run without --dry-run to update %d row(s).',
		$total
	) );
	return;
}

// ── 4. Live run: update each row ─────────────────────────────────────────────
$updated = 0;
$failed  = 0;

foreach ( $rows as $row ) {
	$new_value = preg_replace( '/^\+1 /', '', $row->meta_value );

	$result = $wpdb->update(
		$wpdb->postmeta,
		[ 'meta_value' => $new_value ],
		[ 'meta_id'    => (int) $row->meta_id ],
		[ '%s' ],
		[ '%d' ]
	);

	if ( $result === false ) {
		WP_CLI::warning( "Failed to update post {$row->post_id} (meta_id {$row->meta_id}): {$wpdb->last_error}" );
		$failed++;
	} else {
		$updated++;
	}
}

// ── 5. Report ─────────────────────────────────────────────────────────────────
if ( $failed === 0 ) {
	WP_CLI::success( "Done. Updated {$updated} hp_phone value(s) — '+1 ' prefix removed." );
} else {
	WP_CLI::warning( "Finished with errors: {$updated} updated, {$failed} failed." );
}
