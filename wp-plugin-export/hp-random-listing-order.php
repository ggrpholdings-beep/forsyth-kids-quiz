<?php
/**
 * Plugin Name:  HivePress – Random Listing Order
 * Description:  Randomizes listing order on the default view. If a visitor
 *               explicitly selects Title or Date sort, that choice is respected.
 * Version:      1.0.0
 * Author:       Custom / MU Plugin
 *
 * Drop this file in wp-content/mu-plugins/ — no activation needed.
 *
 * NOTE ON PAGINATION + RANDOM ORDER
 * MySQL's ORDER BY RAND() is re-evaluated on every page load, so visitors
 * paging through results may see duplicate or skipped listings. This is an
 * inherent limitation of SQL-level randomization. If that becomes an issue,
 * replace the rand approach with a session-seeded rand (see bottom comment).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Returns true when the visitor has explicitly chosen a sort order.
 *
 * HivePress passes the active sort key as the `_sort` query-string parameter.
 * An absent or empty `_sort` means "default view" — the case we randomize.
 */
function hprlo_user_chose_sort(): bool {
	return ! empty( $_GET['_sort'] );  // phpcs:ignore WordPress.Security.NonceVerification
}

/**
 * PRIMARY HOOK — HivePress model query filter.
 *
 * HivePress builds a WP_Query args array and passes it through this filter
 * before running both front-end page queries and its REST API queries.
 * Priority 20 runs after HivePress has set its own defaults (priority ≤ 10).
 */
add_filter(
	'hivepress/v1/models/listing/query',
	function ( array $args ): array {
		if ( hprlo_user_chose_sort() ) {
			return $args; // Visitor picked Title or Date — leave it alone.
		}

		$args['orderby'] = 'rand';
		unset( $args['order'] );

		return $args;
	},
	20
);

/**
 * FALLBACK HOOK — pre_get_posts for the main WP query.
 *
 * Catches listing archive / search pages that are driven by the main query
 * rather than a HivePress REST call (e.g., the primary listings page before
 * any JS hydration, or themes that call query_posts directly).
 */
add_action(
	'pre_get_posts',
	function ( WP_Query $query ): void {
		// Only touch the main query on the front end.
		if ( is_admin() || ! $query->is_main_query() ) {
			return;
		}

		// Only touch HivePress listing post-type queries.
		$post_types = (array) $query->get( 'post_type' );
		if ( ! in_array( 'hp_listing', $post_types, true ) ) {
			return;
		}

		if ( hprlo_user_chose_sort() ) {
			return; // Respect the visitor's explicit choice.
		}

		$query->set( 'orderby', 'rand' );
		$query->set( 'order', '' );
	},
	20
);

/*
 * SESSION-SEEDED ALTERNATIVE (optional — not active)
 * -------------------------------------------------------
 * If you want the order to stay consistent while a visitor pages through
 * results during a single session, replace 'rand' with a numeric seed:
 *
 *   if ( session_status() === PHP_SESSION_NONE ) { session_start(); }
 *   if ( empty( $_SESSION['hp_rand_seed'] ) ) {
 *       $_SESSION['hp_rand_seed'] = rand( 1, 999999 );
 *   }
 *   $args['orderby'] = 'RAND(' . (int) $_SESSION['hp_rand_seed'] . ')';
 *
 * Use that block instead of `$args['orderby'] = 'rand';` above.
 * Sessions add server overhead; only worth it if pagination UX matters.
 */
