<?php
/**
 * Plugin Name:  Strip +1 Phone Prefix (Run Once)
 * Description:  On activation, removes the "+1 " prefix from every hp_phone
 *               meta value, logs a summary, then deactivates itself.
 *               Upload to wp-content/plugins/ and activate once. Safe to delete afterward.
 * Version:      1.0.0
 * Author:       Custom / One-Time Migration
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ── Option / transient keys ───────────────────────────────────────────────────
const SPP_RESULT_TRANSIENT = 'spp_run_result';   // stores per-row log (60 s TTL)
const SPP_DEACTIVATE_FLAG  = 'spp_deactivate';   // triggers self-deactivation


// ── 1. ACTIVATION HOOK — do all the work here ────────────────────────────────

register_activation_hook( __FILE__, 'spp_run_migration' );

function spp_run_migration(): void {
	global $wpdb;

	// Find every hp_phone row that begins with '+1 '
	$rows = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT pm.meta_id, pm.post_id, pm.meta_value, p.post_title
			 FROM {$wpdb->postmeta} pm
			 INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
			 WHERE pm.meta_key   = %s
			   AND pm.meta_value LIKE %s
			 ORDER BY pm.post_id",
			'hp_phone',
			$wpdb->esc_like( '+1 ' ) . '%'
		)
	);

	$log     = [];   // human-readable rows shown in the notice
	$updated = 0;
	$failed  = 0;

	foreach ( $rows as $row ) {
		$before    = $row->meta_value;
		$after     = preg_replace( '/^\+1 /', '', $before );
		$title     = mb_strimwidth( $row->post_title, 0, 40, '…' );

		$result = $wpdb->update(
			$wpdb->postmeta,
			[ 'meta_value' => $after ],
			[ 'meta_id'    => (int) $row->meta_id ],
			[ '%s' ],
			[ '%d' ]
		);

		if ( $result === false ) {
			$failed++;
			$log[] = [
				'status' => 'error',
				'id'     => $row->post_id,
				'title'  => $title,
				'before' => $before,
				'after'  => $after,
				'error'  => $wpdb->last_error,
			];
		} else {
			$updated++;
			$log[] = [
				'status' => 'ok',
				'id'     => $row->post_id,
				'title'  => $title,
				'before' => $before,
				'after'  => $after,
			];
		}
	}

	// Persist results for the admin notice (60-second TTL is plenty)
	set_transient( SPP_RESULT_TRANSIENT, [
		'log'     => $log,
		'updated' => $updated,
		'failed'  => $failed,
		'total'   => count( $rows ),
	], 60 );

	// Signal that we should self-deactivate on the very next admin request
	update_option( SPP_DEACTIVATE_FLAG, true, false );
}


// ── 2. SELF-DEACTIVATION — fires on the redirect-back to plugins.php ─────────

add_action( 'admin_init', 'spp_maybe_deactivate' );

function spp_maybe_deactivate(): void {
	if ( ! get_option( SPP_DEACTIVATE_FLAG ) ) {
		return;
	}

	delete_option( SPP_DEACTIVATE_FLAG );

	// deactivate_plugins() lives in an admin-only file; include it if needed.
	if ( ! function_exists( 'deactivate_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	deactivate_plugins( plugin_basename( __FILE__ ) );
}


// ── 3. ADMIN NOTICE — summary shown on the plugins.php page ──────────────────

add_action( 'admin_notices', 'spp_show_result_notice' );

function spp_show_result_notice(): void {
	$data = get_transient( SPP_RESULT_TRANSIENT );
	if ( ! $data ) {
		return;
	}
	delete_transient( SPP_RESULT_TRANSIENT );

	$type    = $data['failed'] > 0 ? 'warning' : 'success';
	$updated = (int) $data['updated'];
	$failed  = (int) $data['failed'];
	$total   = (int) $data['total'];

	// Build the detail table only when there are rows to show
	$table = '';
	if ( ! empty( $data['log'] ) ) {
		$table .= '<table style="border-collapse:collapse;margin-top:8px;font-size:13px;">';
		$table .= '<thead><tr>
			<th style="text-align:left;padding:3px 10px 3px 0;border-bottom:1px solid #ccc;">Post&nbsp;ID</th>
			<th style="text-align:left;padding:3px 10px 3px 0;border-bottom:1px solid #ccc;">Listing</th>
			<th style="text-align:left;padding:3px 10px 3px 0;border-bottom:1px solid #ccc;">Before</th>
			<th style="text-align:left;padding:3px 10px 3px 0;border-bottom:1px solid #ccc;">After</th>
			<th style="text-align:left;padding:3px 0;border-bottom:1px solid #ccc;">Note</th>
		</tr></thead><tbody>';

		foreach ( $data['log'] as $row ) {
			$color = $row['status'] === 'error' ? '#c00' : '#444';
			$note  = $row['status'] === 'error'
				? '<span style="color:#c00;">ERROR: ' . esc_html( $row['error'] ) . '</span>'
				: '<span style="color:green;">&#10003; updated</span>';

			$table .= sprintf(
				'<tr>
					<td style="padding:2px 10px 2px 0;color:%s;">%d</td>
					<td style="padding:2px 10px 2px 0;">%s</td>
					<td style="padding:2px 10px 2px 0;font-family:monospace;">%s</td>
					<td style="padding:2px 10px 2px 0;font-family:monospace;">%s</td>
					<td style="padding:2px 0;">%s</td>
				</tr>',
				esc_attr( $color ),
				(int) $row['id'],
				esc_html( $row['title'] ),
				esc_html( $row['before'] ),
				esc_html( $row['after'] ),
				$note
			);
		}

		$table .= '</tbody></table>';
	}

	// Headline
	if ( $total === 0 ) {
		$headline = 'Strip +1 Phone Prefix: no <code>hp_phone</code> values with a "+1 " prefix were found. Nothing changed.';
	} elseif ( $failed === 0 ) {
		$headline = sprintf(
			'Strip +1 Phone Prefix: <strong>%d phone number%s updated</strong> successfully. The plugin has deactivated itself.',
			$updated,
			$updated === 1 ? '' : 's'
		);
	} else {
		$headline = sprintf(
			'Strip +1 Phone Prefix: %d updated, <strong style="color:#c00;">%d failed</strong>. Check the table below. Plugin deactivated.',
			$updated,
			$failed
		);
	}

	printf(
		'<div class="notice notice-%s is-dismissible"><p>%s</p>%s</div>',
		esc_attr( $type ),
		$headline,
		$table
	);
}
