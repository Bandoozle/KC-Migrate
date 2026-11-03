<?php
/**
 * Read-only export of the AI Chat Assistant data the Next.js chat needs.
 *
 * Run on the WordPress install that serves the live chat (staging.kosick.com):
 *
 *   wp eval-file export-aca-wordpress.php > kosick-chat-export.json
 *
 * It writes nothing: no option, post, meta or counter is changed. In particular
 * it never calls ACA_Training::build_context_for(), which increments use counts.
 * Secrets are reported as present/absent only. The API key never leaves WordPress.
 *
 * Besides the raw settings, KB, trained Q&As and sources, it records what the
 * plugin itself compiles from them ("golden" values), so the Next.js port can be
 * checked against the plugin's own output rather than a re-reading of the code.
 */

if ( ! defined( 'ABSPATH' ) ) {
	fwrite( STDERR, "Run with: wp eval-file export-aca-wordpress.php\n" );
	exit( 1 );
}
if ( ! class_exists( 'ACA_Plugin' ) ) {
	fwrite( STDERR, "AI Chat Assistant is not active on this site.\n" );
	exit( 1 );
}

function kc_opt( $key, $default = '' ) {
	return get_option( 'aca_' . $key, $default );
}

$settings_keys = array(
	'enabled', 'model', 'business_name', 'knowledge_base', 'greeting', 'phone_number',
	'phone_cta_label', 'form_cta_label', 'enable_phone_cta', 'enable_form_cta',
	'notification_email', 'monitoring_email', 'conversion_focus', 'response_length',
	'log_conversations', 'retention_days', 'widget_title', 'subtitle', 'avatar_url',
	'launcher_icon_url', 'teaser_text', 'show_teaser', 'teaser_delay', 'primary_color', 'position',
);
$settings = array();
foreach ( $settings_keys as $key ) {
	$settings[ $key ] = kc_opt( $key, null );
}
// The address lead emails actually go to (the option, falling back to the admin email).
$settings['notification_email_resolved'] = ACA_Plugin::get_option( 'notification_email', get_option( 'admin_email' ) );
$settings['hours'] = array(
	'restrict_calls' => get_option( 'aca_hours_restrict_calls', null ),
	'days'           => get_option( 'aca_hours_days', null ),
	'start'          => get_option( 'aca_hours_start', null ),
	'end'            => get_option( 'aca_hours_end', null ),
	'timezone'       => get_option( 'aca_hours_timezone', null ),
);

$central_enabled = class_exists( 'ACA_Central' ) && ACA_Central::is_enabled();

// Trained Q&As, in the plugin's own order (ACA_Training::all(): date DESC, max 200).
$training = array();
if ( class_exists( 'ACA_Training' ) ) {
	foreach ( ACA_Training::all( false ) as $index => $row ) {
		$training[] = array(
			'order'     => $index,
			'id'        => (int) $row['id'],
			'question'  => (string) $row['question'],
			'answer'    => (string) $row['answer'],
			'tags'      => (string) $row['tags'],
			'active'    => (bool) $row['active'],
			'created'   => (string) $row['created'],
			'use_count' => (int) $row['use_count'],
		);
	}
}

// Knowledge sources, in the plugin's own order (ACA_Sources::all(): date DESC, all).
$sources = array();
if ( class_exists( 'ACA_Sources' ) ) {
	foreach ( ACA_Sources::all( false ) as $index => $post ) {
		$sources[] = array(
			'order'   => $index,
			'id'      => (int) $post->ID,
			'title'   => (string) $post->post_title,
			'content' => (string) $post->post_content,
			'active'  => 'publish' === $post->post_status,
			'date'    => (string) $post->post_date,
			'type'    => (string) get_post_meta( $post->ID, '_aca_source_type', true ),
			'url'     => (string) get_post_meta( $post->ID, '_aca_source_url', true ),
		);
	}
}

// What the plugin compiles from that data, as reference values for the port.
$golden = array(
	'kb_compiled'              => class_exists( 'ACA_KB' ) ? ACA_KB::compile() : '',
	'sources_compiled'         => class_exists( 'ACA_Sources' ) ? ACA_Sources::compile() : '',
	// An empty question skips trained Q&A injection, so this call is side-effect free.
	'system_prompt_no_question' => class_exists( 'ACA_Claude_Client' ) ? ACA_Claude_Client::build_system_prompt( '' ) : '',
	'max_tokens'               => class_exists( 'ACA_Claude_Client' ) ? ACA_Claude_Client::max_tokens_for_length() : null,
	'calls_open'               => class_exists( 'ACA_Hours' ) ? ACA_Hours::calls_open() : true,
	'evaluated_at'             => gmdate( 'c' ),
	'hours_phrase'             => ( class_exists( 'ACA_Hours' ) && method_exists( 'ACA_Hours', 'visitor_hours_phrase' ) ) ? ACA_Hours::visitor_hours_phrase() : '',
	'spoken_timezone'          => ( class_exists( 'ACA_Hours' ) && method_exists( 'ACA_Hours', 'spoken_name' ) ) ? ACA_Hours::spoken_name() : '',
	'resolved_timezone'        => class_exists( 'ACA_Hours' ) ? ACA_Hours::timezone()->getName() : wp_timezone_string(),
	'matches'                  => array(),
);

// find_matches() is read-only. Probe with every active question plus a few generic ones.
if ( class_exists( 'ACA_Training' ) ) {
	$probes = array( 'How much does a website cost?', 'What services do you offer?', 'Do you do TV advertising?', 'What are your hours?' );
	foreach ( $training as $row ) {
		if ( $row['active'] ) {
			$probes[] = $row['question'];
		}
	}
	foreach ( array_values( array_unique( $probes ) ) as $probe ) {
		$golden['matches'][] = array(
			'question' => $probe,
			'ids'      => array_map(
				function ( $m ) {
					return array( 'id' => (int) $m['id'], 'score' => (float) $m['score'] );
				},
				ACA_Training::find_matches( $probe, 3 )
			),
		);
	}
}

$counts = array();
foreach ( array( 'aca_lead', 'aca_conversation', 'aca_training', 'aca_source' ) as $type ) {
	$c = wp_count_posts( $type );
	$counts[ $type ] = is_object( $c ) ? array_sum( array_map( 'intval', (array) $c ) ) : 0;
}

$export = array(
	'export_version' => 1,
	'exported_at'    => gmdate( 'c' ),
	'plugin'         => array(
		'version'      => defined( 'ACA_VERSION' ) ? ACA_VERSION : '',
		'central_mode' => $central_enabled,
	),
	'site'           => array(
		'name'            => get_bloginfo( 'name' ),
		'home_url'        => home_url(),
		'wp_timezone'     => wp_timezone_string(),
		'admin_email_set' => '' !== (string) get_option( 'admin_email' ),
	),
	'secrets'        => array(
		'api_key_set'        => '' !== (string) kc_opt( 'api_key', '' ),
		'backend_url_set'    => '' !== (string) kc_opt( 'backend_url', '' ) || defined( 'ACA_AI_BACKEND_URL' ),
		'backend_secret_set' => '' !== (string) kc_opt( 'backend_secret', '' ) || defined( 'ACA_AI_BACKEND_SECRET' ),
	),
	'settings'       => $settings,
	'kb'             => class_exists( 'ACA_KB' ) ? ACA_KB::get_data() : null,
	'training'       => $training,
	'sources'        => $sources,
	'golden'         => $golden,
	'counts'         => $counts,
);

echo wp_json_encode( $export, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
echo "\n";
