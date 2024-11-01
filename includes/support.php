<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WFW_Support' ) ) {

	/**
	 * Class WFW_Support
	 * 1.0.5
	 */
	class WFW_Support {
		public function __construct( $data ) {
			$this->data               = array();
			$this->data['support']    = $data['support'];
			$this->data['web']       = $data['web'];
			$this->data['review']     = $data['review'];
			$this->data['css_url']    = $data['css'];
			$this->data['images_url'] = $data['image'];
			$this->data['slug']       = $data['slug'];
			$this->data['menu_slug']  = $data['menu_slug'];
			$this->data['version']    = isset( $data['version'] ) ? $data['version'] : '1.0.0';
	
			add_action( 'wfw_support_' . $this->data['slug'], array( $this, 'wfw_support' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'scripts' ) );
			add_action( 'admin_notices', array( $this, 'review_notice' ) );
			add_action( 'admin_init', array( $this, 'hide_review_notice' ) );
			add_action( 'admin_menu', array( $this, 'admin_menu' ), 9999 );

			/*Admin notices*/
			if ( ! get_transient( 'wfw_call' ) || get_transient( 'wfw_call' ) == $this->data['slug'] ) {
				set_transient( 'wfw_call', $this->data['slug'], 86400 );
				/*Hide notices*/
				add_action( 'admin_init', array( $this, 'hide_notices' ) );

				add_action( 'admin_notices', array( $this, 'form_ads' ) );

				/*Admin dashboard*/
				add_action( 'wp_dashboard_setup', array( $this, 'dashboard' ) );
			}
		}

		

	/**
		 * Dashboard widget
		 */
		public function dashboard() {
			$hide = get_transient( 'wfw_hide_notices' );
			if ( $hide ) {
				return;
			}
			wp_add_dashboard_widget( 'wfw_dashboard_status', __( 'wfw Offer', $this->data['slug'] ), array(
				$this,
				'widget'
			) );
		}

		public function widget() {

			$default = array(
				'heading'     => '',
				'description' => '',
				'link'        => ''
			);
			$data    = get_transient( 'wfw_notices' );

			
			if ( ! is_array( $data ) ) {
				return;
			}
			$data = wp_parse_args( $data, $default );
			if ( ! $data['heading'] && ! $data['description'] ) {
				return;
			} ?>
            <div class="wfw-dashboard">
                <div class="wfw-content">
					<?php if ( $data['heading'] ) { ?>
                        <div class="wfw-left">
							<?php echo $data['heading'] ?>
                        </div>
					<?php } ?>
                    <div class="wfw-right">
						<?php if ( $data['description'] ) { ?>
                            <div class="wfw-description">
								<?php echo $data['description']; ?>
                            </div>
						<?php } ?>
                        <div class="wfw-notification-controls">
							<?php if ( $data['link'] ) { ?>
                                <a target="_blank" href="<?php echo esc_url( $data['link'] ) ?>"
                                   class="wfw-button wfw-primary"><?php esc_html_e( 'View', $this->data['slug'] ) ?></a>
							<?php } ?>
                            <a href="<?php echo esc_url( wp_nonce_url( add_query_arg( 'wfw-hide-notice', '1' ), 'hide_notices', '_wfw_nonce' ) ); ?>"
                               class="wfw-button"><?php esc_html_e( 'Skip', $this->data['slug'] ) ?></a>
                        </div>
                    </div>
                </div>

            </div>

		<?php }	


		/**
		 * Hide notices
		 */
		public function hide_review_notice() {

			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}
			if ( ! isset( $_GET['_wfw_nonce'] ) ) {
				return;
			}
			if ( wp_verify_nonce( $_GET['_wfw_nonce'], $this->data['slug'] . '_dismiss_notices' ) ) {
				update_option( $this->data['slug'] . '_dismiss_notices', 1 );
			}
			if ( wp_verify_nonce( $_GET['_wfw_nonce'], $this->data['slug'] . '_hide_notices' ) ) {
				set_transient( $this->data['slug'] . $this->data['version'] . '_hide_notices', 1, 2592000 );
			}
			if ( wp_verify_nonce( $_GET['_wfw_nonce'], $this->data['slug'] . '_wp_reviewed' ) ) {
				set_transient( $this->data['slug'] . $this->data['version'] . '_hide_notices', 1, 2592000 );
				update_option( $this->data['slug'] . '_wp_reviewed', 1 );
				ob_start();
				ob_end_clean();
				wp_redirect( $this->data['review'] );
				die;
			}
		}

		/**
		 * Show review wordpress
		 */
		public function review_notice() {
			if ( get_option( $this->data['slug'] . '_dismiss_notices', 0 ) ) {
				return;
			}
			if ( get_transient( $this->data['slug'] . $this->data['version'] . '_hide_notices' ) ) {
				return;
			}
			$name         = str_replace( '-', ' ', $this->data['slug'] );
			$name         = ucwords( $name );
			$check_review = get_option( $this->data['slug'] . '_wp_reviewed', 0 );
			$check_start  = get_option( $this->data['slug'] . '_start_use', 0 );
			if ( ! $check_start ) {
				update_option( $this->data['slug'] . '_start_use', 1 );
				set_transient( $this->data['slug'] . $this->data['version'] . '_hide_notices', 1, 259200 );

				return;
			}
			
			?>

            <div class="wfw-dashboard updated" style="border-left: 4px solid #ffba00">
                <div class="wfw-content">
                    <form action="" method="get">
						<?php if ( ! $check_review ) { ?>
                            <p><?php echo esc_html__( 'Hi there! You\'ve been using ', $this->data['slug'] ) . '<strong>' . $name . '</strong>' . esc_html__( ' on your site for a few days - I hope it\'s been helpful. If you\'re enjoying my plugin, would you mind rating it 5-stars to help spread the word?', $this->data['slug'] ) ?></p>
						<?php } else { ?>
                            <p><?php echo esc_html__( 'Hi there! You\'ve been using ', $this->data['slug'] ) . '<strong>' . $name . '</strong>' . esc_html__( ' on your site for a few days - I hope it\'s been helpful. Would you want get more features?', $this->data['slug'] ) ?></p>
						<?php } ?>
                        <p>
                            <a href="<?php echo esc_url( wp_nonce_url( @add_query_arg(), $this->data['slug'] . '_hide_notices', '_wfw_nonce' ) ); ?>"
                               class="button"><?php esc_html_e( 'Thanks, later', $this->data['slug'] ) ?></a>
							<?php if ( ! $check_review ) { ?>
                                <button class="button button-primary"><?php esc_html_e( 'Rate now', $this->data['slug'] ) ?></button>
								<?php wp_nonce_field( $this->data['slug'] . '_wp_reviewed', '_wfw_nonce' ) ?>
							<?php } ?>
							
                            <a target="_self"
                               href="<?php echo esc_url( wp_nonce_url( @add_query_arg(), $this->data['slug'] . '_dismiss_notices', '_wfw_nonce' ) ); ?>"
                               class="button notice-dismiss vi-button-dismiss"><?php esc_html_e( 'Dismiss', $this->data['slug'] ) ?></a>
                        </p>
                    </form>
                </div>

            </div>
		<?php }

	

		/**
		 * Hide notices
		 */
		public function hide_notices() {
			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}
			if ( ! isset( $_GET['wfw-hide-notice'] ) && ! isset( $_GET['_wfw_nonce'] ) ) {
				return;
			}
			if ( wp_verify_nonce( $_GET['_wfw_nonce'], 'hide_notices' ) ) {
				if ( $_GET['wfw-hide-notice'] == 1 ) {
					set_transient( 'wfw_hide_notices', 1, 86400 );
				} else {
					set_transient( 'wfw_hide_notices', 1, 86400 * 30 );

				}
			}
		}

		/**
		 * Init script
		 */
		public function scripts() {
			wp_enqueue_style( 'wfw-support', $this->data['css_url'] . 'wfw-support.css' );
		}

		/**
		 *
		 */
		public function wfw_support() { ?>

		<div class="wrap ui grid container">
        
            <div id="wfw-support" class="vi-ui form segment">
   			   <h1 style="text-align: left;font-weight:bold;margin-left:10px;"><?php echo esc_html__( 'Social Avocadoo', $this->data['slug'] ) ?></h1>
   			   <hr>
                <div class="fields">                    
						                  
                    <div class="six wide field ">
	                    <div class="wfw-docs-area">
                            <a target="_blank" href="<?php echo esc_url( $this->data['web'] ) ?>">
                                <img src="<?php echo $this->data['images_url'] . 'Schedule_social_media_posts1.png' ?>">
                            </a>
                        </div>                       
                    </div>

                    <div class="six wide field ">
                        <div class="wfw-docs-area">
                            <a target="_blank" href="<?php echo esc_url( $this->data['web'] ) ?>">
                                <img src="<?php echo $this->data['images_url'] . 'Schedule_social_media_posts2.png' ?>">
                            </a>
                        </div>                       
                    </div>

                    
					
                </div>

				<div class="fields">     
                	<div class="six wide field ">
                        <div class="wfw-docs-area">
                            <a target="_blank" href="<?php echo esc_url( $this->data['web'] ) ?>">
                                <img src="<?php echo $this->data['images_url'] . 'Schedule_social_media_posts3.png' ?>">
                            </a>
                        </div>                       
                    </div>

                    <div class="six wide field ">
                        <div class="wfw-docs-area">
                            <a target="_blank" href="<?php echo esc_url( $this->data['web'] ) ?>">
                                <img src="<?php echo $this->data['images_url'] . 'Schedule_social_media_posts4.png' ?>">
                            </a>
                        </div>                       
                    </div>     

				</div>

            </div>
        </div>    
		<?php }

		/**
		 * Get data from server
		 * @return array
		 */
		
	}
}
new WFW_Support(
	array(
		'web'      =>  'http://www.socialavocadoo.com/',
		'review'    => 'https://wordpress.org/support/plugin/wp-fortune-wheel/reviews/?rate=5#rate-response',
		'css'       => VI_WP_FORTUNE_WHEEL_CSS,
		'image'     => VI_WP_FORTUNE_WHEEL_IMAGES,
		'slug'      => 'wp-fortune-wheel',
		'menu_slug' => 'wp-fortune-wheel',
		'version'   => VI_WP_FORTUNE_WHEEL_VERSION
	)
);