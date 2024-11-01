<?php
// no direct access allowed
if ( ! defined( 'ABSPATH' ) ) {
	die();
}
define( 'VI_WP_FORTUNE_WHEEL_DIR', WP_PLUGIN_DIR . DIRECTORY_SEPARATOR . "wp-fortune-wheel" . DIRECTORY_SEPARATOR );
//$plugin_url = plugins_url( 'wp-fortune-wheel' );
$plugin_url = plugins_url( '', __FILE__ );
$plugin_url = str_replace( '/includes', '', $plugin_url );
define( 'VI_WP_FORTUNE_WHEEL_CSS', $plugin_url . "/css/" );
define( 'VI_WP_FORTUNE_WHEEL_JS', $plugin_url . "/js/" );
define( 'VI_WP_FORTUNE_WHEEL_IMAGES', $plugin_url . "/images/" );

if(is_file(WP_FORTUNE_WHEEL_INCLUDES . "support.php")) {
	require_once WP_FORTUNE_WHEEL_INCLUDES . "support.php";
}

if(is_file(WP_FORTUNE_WHEEL_INCLUDES . "mobile_detect.php")) {
	require_once WP_FORTUNE_WHEEL_INCLUDES . "mobile_detect.php";
}



if ( ! function_exists( 'wplwl_is_url_exist' ) ) {
	function wplwl_is_url_exist( $url ) {
		$ch = curl_init( $url );
		curl_setopt( $ch, CURLOPT_NOBODY, true );
		curl_exec( $ch );
		$code = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
		if ( $code == 200 ) {
			$status = true;
		} else {
			$status = false;
		}
		curl_close( $ch );

		return $status;
	}
}




if ( ! function_exists( 'wfw_get_explode' ) ) {
	function wfw_get_explode( $sap = ',', $string, $limit = 3 ) {
		$rand       = 0;
		$show_wheel = explode( $sap, $string, $limit );
		$show_wheel = array_map( 'absInt', $show_wheel );
		if ( sizeof( $show_wheel ) > 1 ) {
			$rand = $show_wheel[0] < $show_wheel[1] ? rand( $show_wheel[0], $show_wheel[1] ) : rand( $show_wheel[1], $show_wheel[0] );
		} else {
			$rand = $show_wheel[0];
		}

		return $rand;
	}
}
if ( ! function_exists( 'wfw_sanitize_text_field' ) ) {
	function wfw_sanitize_text_field( $string ) {
		return sanitize_text_field( stripslashes( $string ) );
	}
}