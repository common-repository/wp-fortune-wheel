'use strict';
jQuery(document).ready(function () {
    jQuery('.prize_type').on('change',function () {
        if(jQuery(this).val()=='non'){
            jQuery(this).parent().parent().find('.custom_type_value').prop('readonly',true);
            jQuery(this).parent().parent().find('.custom_type_value').val('');
        }else{
            jQuery(this).parent().parent().find('.custom_type_value').prop('readonly',false);
        }
    });
    jQuery('.vi-ui.tabular.menu .item').vi_tab({
        history: true,
        historyType: 'hash'
    });

    jQuery('.vi-ui.dropdown').dropdown();
    /*Setup tab*/
    var tabs,
        tabEvent = false,
        initialTab = 'general',
        navSelector = '.vi-ui.menu',
        navFilter = function (el) {
            // return jQuery(el).attr('href').replace(/^#/, '');
        },
        panelSelector = '.vi-ui.tab',
        panelFilter = function () {
            jQuery(panelSelector + ' a').filter(function () {
                return jQuery(navSelector + ' a[title=' + jQuery(this).attr('title') + ']').size() != 0;
            });
        };

    // Initializes plugin features
    jQuery.address.strict(false).wrap(true);

    if (jQuery.address.value() == '') {
        jQuery.address.history(false).value(initialTab).history(true);
    }

    // Address handler
    jQuery.address.init(function (event) {

        // Adds the ID in a lazy manner to prevent scrolling
        jQuery(panelSelector).attr('id', initialTab);

        panelFilter();

        // Tabs setup
        tabs = jQuery('.vi-ui.menu')
            .vi_tab({
                history: true,
                historyType: 'hash'
            })

        // Enables the plugin for all the tabs
        jQuery(navSelector + ' a').click(function (event) {
            tabEvent = true;
            // jQuery.address.value(navFilter(event.target));
            tabEvent = false;
            return true;
        });

    });
    jQuery('.wheel-settings .ui-sortable').sortable({
        update: function (event, ui) {
            indexChangeCal();
        }
    });

    /*Color picker*/
    jQuery('.color-picker').iris({
        change: function (event, ui) {
            jQuery(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
            var ele = jQuery(this).data('ele');
            if (ele == 'highlight') {
                jQuery('#message-purchased').find('a').css({'color': ui.color.toString()});
            } else if (ele == 'textcolor') {
                jQuery('#message-purchased').css({'color': ui.color.toString()});
            } else {
                jQuery('#message-purchased').css({backgroundColor: ui.color.toString()});
            }
        },
        hide: true,
        border: true
    }).click(function () {
        jQuery('.iris-picker').hide();
        jQuery(this).closest('td').find('.iris-picker').show();
    });

    jQuery('body').click(function () {
        jQuery('.iris-picker').hide();
    });
    jQuery('.color-picker').click(function (event) {
        event.stopPropagation();
    });

    //check Probability value
    jQuery('.probability').keyup(function () {
        var check_max = jQuery(this).val();
        if (check_max > 100) {
            jQuery(this).val(100);
        }

    });
    remove_piece();


    function clone_piece() {
        jQuery('.clone_piece').on('click', function () {
            if (jQuery('.wheel_col').length >= 6) {
                alert("Maximum pieces quantity is 6");
            }
            else {
                var new_row = jQuery(this).parent().parent().clone();
                var total_temp = parseInt(jQuery('.total_probability').attr('data-total_probability'));
                var new_val = 0;
                if (total_temp + parseInt(new_row.find('input[name="probability[]"]').val()) <= 100) {
                    new_val = parseInt(new_row.find('input[name="probability[]"]').val());
                }
                jQuery('.total_probability').html(total_temp + new_val);
                jQuery('.total_probability').attr('data-total_probability', total_temp + new_val);
                new_row.find('input[name="probability[]"]').val(new_val);

                new_row.insertAfter(jQuery(this).parent().parent());
                indexChangeCal();
                changes_probability();
                remove_piece();
                jQuery('.color-picker').iris({
                    change: function (ev, uis) {
                        jQuery(this).parent().find('.color-picker').css({backgroundColor: uis.color.toString()});
                    },
                    hide: true,
                    border: true,
                    width: 270
                }).on('click', function (e) {
                    e.stopPropagation();
                });
                jQuery('.clone_piece').unbind();
                clone_piece();
            }
        });

    }

    clone_piece();

    function remove_piece() {
        jQuery('.remove_field').unbind();
        jQuery('.probability').on('change', function () {
            changes_probability();
        });
        jQuery('.remove_field').on('click', function () {
            changes_probability();
            if (confirm("Would you want to remove this?")) {
                if (jQuery('.wheel_col').length > 3) {
                    jQuery(this).closest('tr').remove();
                    changes_probability();
                    indexChangeCal();
                } else {
                    alert('Must have at least 3 columns!');
                    return false;
                }
            }
        });
    }

    function changes_probability() {// check probability
        var tong = 0;
        jQuery('.probability').each(function () {
            var chek = jQuery(this).val();
            if (jQuery.isNumeric(chek) === true) {
                tong += parseInt(chek);
            }
        });
        jQuery('.total_probability').html(tong);
        jQuery('.total_probability').attr('data-total_probability', tong);
        return tong;
    }

    jQuery('#submit1').on('click', function () {
        var tong = changes_probability();
        var label = document.getElementsByClassName('custom_type_label');

        if (tong == 100) {
            for (var i = 0; i < label.length; i++) {
                if (jQuery('.custom_type_label').eq(i).val() === '') {
                    alert('Label cannot be empty.');
                    jQuery('.custom_type_label').eq(i).focus();
                    return false;

                }
                if (jQuery('.prize_type').eq(i).val() === 'custom' && jQuery('.custom_type_value').eq(i).val() === '') {
                    alert('Value cannot be empty.');
                    jQuery('.custom_type_value').eq(i).focus();
                    return false;

                }
            }
            return true;
        } else {
            alert('The total probability must be 100%.');
            return false;
        }

    });

    function indexChangeCal() {
        var ind = document.getElementsByClassName('wheel_col_index');
        for (var i = 0; i < ind.length; i++) {
            jQuery('.wheel_col_index')[i].innerHTML = (i + 1);
        }
    }

    indexChangeCal();

    jQuery('.wfw_color_palette').on('click', function () {
        var color_array;
        color_array = jQuery(this).parent().children().map(function () {
            return jQuery(this).attr('data-color_code');
        }).get();
        var color_size = color_array.length;
        var piece_color;
        piece_color = jQuery('.wheel_col').find('.color-picker').map(function () {
            return jQuery(this).val();
        }).get();
        var piece_size = piece_color.length;
        var i;
        var j = 0;

        for (i = 0; i < piece_size; i++) {
            if (j == color_size) {
                j = 0;
            }
            jQuery('.wheel_col').find('.color-picker').eq(i).attr('value', color_array[j]);
            jQuery('.wheel_col').find('.color-picker').eq(i).css({'background-color': color_array[j]});
            j++;
        }
        jQuery('.auto_color_ok').on('click', function () {
            jQuery('.color_palette').hide();
            jQuery('.auto_color_ok_cancel').hide();
            jQuery('.auto_color').show();
        });
        jQuery('.auto_color_cancel').on('click', function () {
            j = 0;
            for (i = 0; i < piece_size; i++) {
                if (j == color_size) {
                    j = 0;
                }
                jQuery('.wheel_col').find('.color-picker').eq(i).attr('value', piece_color[j]);
                jQuery('.wheel_col').find('.color-picker').eq(i).css({'background-color': piece_color[j]});
                j++;
            }
            jQuery('.color_palette').hide();
            jQuery('.auto_color_ok_cancel').hide();
            jQuery('.auto_color').show();
        })
    });
    jQuery('.auto_color').on('click', function () {
        jQuery('.color_palette').css({'display': 'flex'});
        jQuery('.auto_color_ok_cancel').css({'display': 'inline-block'});
        jQuery(this).hide();
        jQuery('.auto_color_ok').on('click', function () {
            jQuery('.color_palette').hide();
            jQuery('.auto_color_ok_cancel').hide();
            jQuery('.auto_color').show();
        });
        jQuery('.auto_color_cancel').on('click', function () {
            jQuery('.color_palette').hide();
            jQuery('.auto_color_ok_cancel').hide();
            jQuery('.auto_color').show();
        })
    });

    // select google font
    jQuery('#wfw-google-font-select').fontselect().change(function () {
        // replace + signs with spaces for css
        jQuery('#wfw-google-font-select').val(jQuery(this).val());
        jQuery('.wfw-google-font-select-remove').show();
    });
    jQuery('.wfw-google-font-select-remove').on('click', function () {
        jQuery(this).parent().find('.font-select span').html('<span>Select a font</span>');
        jQuery('#wfw-google-font-select').val('');
        jQuery(this).hide();
    })
});

jQuery(document).ready(function ($) {
    // Set all variables to be used in scope
    var frame,
        metaBox = jQuery('#wfw-bg-image'), // Your meta box id here
        addImgLink = metaBox.find('.wfw-upload-custom-img'),
        imgContainer = metaBox.find('#wfw-new-image');

    // ADD IMAGE LINK
    addImgLink.on('click', function (event) {
        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (frame) {
            frame.open();
            return;
        }

        // Create a new media frame
        frame = wp.media({
            title: 'Select or Upload Media Of Your Chosen Persuasion',
            button: {
                text: 'Use this media'
            },
            multiple: false  // Set to true to allow multiple files to be selected
        });


        // When an image is selected in the media frame...
        frame.on('select', function () {

            // Get media attachment details from the frame state
            var attachment = frame.state().get('selection').first().toJSON();
            console.log(attachment);
            var attachment_url;
            if (attachment.sizes.thumbnail) {
                attachment_url = attachment.sizes.thumbnail.url;
            } else if (attachment.sizes.medium) {
                attachment_url = attachment.sizes.medium.url;
            } else if (attachment.sizes.large) {
                attachment_url = attachment.sizes.large.url;
            } else if (attachment.url) {
                attachment_url = attachment.url;
            }
            // Send the attachment URL to our custom image input field.
            imgContainer.append('<div class="wfw-image-container"><img style="border: 1px solid;"class="review-images" src="' + attachment_url + '"/><input class="wheel_wrap_bg_image" name="wheel_wrap_bg_image" type="hidden" value="' + attachment.id + '"/><span class="wfw-remove-image nagative vi-ui button">Remove</span></div>');

            jQuery('.wfw-upload-custom-img').hide();
            jQuery('.wfw-remove-image').on('click', function (event) {
                event.preventDefault();
                jQuery(this).parent().html('');
                jQuery('.wfw-upload-custom-img').show();
            })

        });

        // Finally, open the modal on click
        frame.open();
    });
    // DELETE IMAGE LINK

    jQuery('.wfw-remove-image').on('click', function (event) {
        event.preventDefault();
        jQuery(this).parent().html('');
        jQuery('.wfw-upload-custom-img').show();
    });

    
});
jQuery(document).ready(function ($) {
    // Set all variables to be used in scope
    var frame1,
        metaBox1 = jQuery('#wfw-bg-image1'), // Your meta box id here
        addImgLink1 = metaBox1.find('.wfw-upload-custom-img1'),
        imgContainer1 = metaBox1.find('#wfw-new-image1');

    // ADD IMAGE LINK
    addImgLink1.on('click', function (event) {
        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (frame1) {
            frame1.open();
            return;
        }

        // Create a new media frame
        frame1 = wp.media({
            title: 'Select or Upload Media Of Your Chosen Persuasion',
            button: {
                text: 'Use this media'
            },
            multiple: false  // Set to true to allow multiple files to be selected
        });


        // When an image is selected in the media frame...
        frame1.on('select', function () {

            // Get media attachment details from the frame state
            var attachment1 = frame1.state().get('selection').first().toJSON();
            console.log(attachment1);
            var attachment_url1;
            if (attachment1.sizes.thumbnail) {
                attachment_url1 = attachment1.sizes.thumbnail.url;
            } else if (attachment1.sizes.medium.url) {
                attachment_url1 = attachment1.sizes.medium;
            } else if (attachment1.sizes.large.url) {
                attachment_url1 = attachment1.sizes.large;
            } else if (attachment1.url) {
                attachment_url1 = attachment1.url;
            }

            // Send the attachment URL to our custom image input field.
            imgContainer1.append('<div class="wfw-image-container1"><img style="border: 1px solid;"class="review-images" src="' + attachment_url1 + '"/><input class="wheel_center_image" name="wheel_center_image" type="hidden" value="' + attachment1.id + '"/><span class="wfw-remove-image1 nagative vi-ui button">Remove</span></div>');

            jQuery('.wfw-upload-custom-img1').hide();
            jQuery('.wfw-remove-image1').on('click', function (event) {
                event.preventDefault();
                jQuery(this).parent().html('');
                jQuery('.wfw-upload-custom-img1').show();
            })

        });

        // Finally, open the modal on click
        frame1.open();
    });
    // DELETE IMAGE LINK

    jQuery('.wfw-remove-image1').on('click', function (event) {
        event.preventDefault();
        jQuery(this).parent().html('');
        jQuery('.wfw-upload-custom-img1').show();
    });

});
