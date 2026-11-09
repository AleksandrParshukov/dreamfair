function init_menu() {
  const MOBILE_MENU_RESOLUTION = 1200;

  const $header = $('.header'),
    $js_header_menu_toggle = $('.js_header_menu_toggle'),
    $main_nav = $('.main-nav');

  $js_header_menu_toggle.on('click', function () {
    $('.bar').toggleClass('animate');
    disable_toggle();

    if ($main_nav.is('.open')) {
      $main_nav.removeClass('open');
      $('html').removeClass('modal-open');
    } else {
      $main_nav.addClass('open');
      $('html').addClass('modal-open');
    }

    function disable_toggle() {
      $js_header_menu_toggle.addClass('disabled');

      setTimeout(() => {
        $js_header_menu_toggle.removeClass('disabled');
      }, 600);
    }
  });

  const scroll_trigger_height = 50; // Порог, после которого фон изменится

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > scroll_trigger_height) {
      $header.addClass('header--scrolled');
    } else {
      $header.removeClass('header--scrolled');
    }
  });

  if ($(window).width() < MOBILE_MENU_RESOLUTION) {
    init_mobile_menu();
  } else {
    init_tablet_menu();
  }

  function init_tablet_menu() {
    const $submenus = $('.js_submenu');

    if (!$submenus.length) {
      return false;
    }

    var is_touch_device = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    if (is_touch_device) {
      // На тач-устройствах: отключаем стандартный hover-эффект и включаем раскрытие по тапу
      $submenus.prev('a').on('touchend', function (e) {
        const $link = $(this),
          $submenu = $link.next('.js_submenu');

        // Если подменю уже открыто, позволяем перейти по ссылке
        if ($link.hasClass('submenu_open')) {
          $link.removeClass('submenu_open');
          return true; // переход по ссылке
        }

        // Иначе — открываем подменю и предотвращаем переход
        e.preventDefault();

        // Закрываем другие открытые подменю того же уровня
        if (!$link.closest('.submenu_open + .js_submenu')) {
          $submenus.prev('a').not($link).removeClass('submenu_open');
        }

        // Открываем текущее
        $link.addClass('submenu_open');
      });

      // Клик вне меню — закрываем все подменю
      $(document).on('touchstart', function (e) {
        if (!$(e.target).closest($submenus).length) {
          $submenus.prev('a').removeClass('submenu_open');
        }
      });
    }
  }

  function init_mobile_menu() {
    const $submenus = $('.js_submenu');

    if (!$submenus.length) {
      return false;
    }

    $('.js_submenu').each(function () {
      const $submenu_wrap = $(this),
        $toggle = $submenu_wrap.prev('a');

      let animating = false; // блокировка кликов

      $toggle.on('click', function (e) {
        e.preventDefault();
        if (animating) return;

        const $parent_wrap = $submenu_wrap.parent().closest('.js_submenu'),
          is_third_level = $parent_wrap.length > 0;

        if (is_third_level) {
          const $existing_clone = $parent_wrap.children('.submenu-clone');

          if ($existing_clone.length) {
            animating = true;
            // закрываем клон третьего уровня
            $existing_clone.slideUp(200, function () {
              $existing_clone.remove();
              $submenu_wrap.css('display', 'none'); // оригинал остаётся скрытым
              $parent_wrap.removeClass('open'); // снимаем open с родителя второго уровня
              animating = false;
            });
          } else {
            animating = true;
            // скрываем оригинал третьего уровня
            $submenu_wrap.css('display', 'none');

            // клонируем содержимое третьего уровня внутрь родителя второго уровня
            const $clone = $submenu_wrap.children('.main-nav__submenu').clone();
            $clone.addClass('submenu-clone').hide();
            $parent_wrap.append($clone);
            $clone.slideDown(200, function () {
              animating = false;
            });

            // добавляем open только родителю (второй уровень)
            $parent_wrap.addClass('open');
          }
        } else {
          animating = true;
          if ($submenu_wrap.is(':visible')) {
            // закрытие второго уровня
            $submenu_wrap.slideUp(200, function () {
              // удаляем open после завершения анимации
              $submenu_wrap.removeClass('open');
              animating = false;
            });

            // удаляем клон третьего уровня, если он есть
            const $existing_clone = $submenu_wrap.find('.submenu-clone');
            if ($existing_clone.length) {
              $existing_clone.remove();
            }
          } else {
            // открытие второго уровня
            $submenu_wrap.slideDown(200, function () {
              $submenu_wrap.addClass('open');
              animating = false;
            });
          }
        }
      });
    });
  }
}

function init_contact_form() {
  const $callback_form = $('.js_contact_form');

  $('input[name="phone"]').on('keydown', function (evt) {
    $(this).mask('+7 (000) 000-00-00');
  });

  $callback_form.each(function () {
    const $form = $(this);
    $form.validate({
      errorPlacement: function (error, element) {},
    });
  });

  /*  for dev */
  $('.contact-form .js_contact_form').on('submit', function () {
    $('.contact-form .js_contact_form_success').addClass('open');
  });

  $('.js_contact_form_success .modal__btn').on('click', function (evt) {
    $('.contact-form .js_contact_form_success').removeClass('open');
  });

  $('.modal .js_contact_form').on('submit', function () {
    const $form = $(this),
      $modal = $form.closest('.modal');

    $modal.removeClass('open');

    $('#success').addClass('open');
  });
}

function init_sliders() {
  if ($('.js_banner_slider').length) {
    $('.js_banner_slider').slick({
      dots: true,
      appendDots: $('.banner .slider__dots'),
      infinite: true,
      prevArrow: $('.banner .slider__prev'),
      nextArrow: $('.banner .slider__next'),
      slidesToShow: 1,
      slidesToScroll: 1,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            dots: false,
          },
        },
      ],
    });
  }

  if ($('.js_idx_products_slider').length) {
    $('.js_idx_products_slider').slick({
      dots: true,
      appendDots: $('.idx-products .slider__dots'),
      infinite: true,
      prevArrow: $('.idx-products .slider__prev'),
      nextArrow: $('.idx-products .slider__next'),
      slidesToShow: 1,
      slidesToScroll: 1,
      swipeToSlide: true,
    });
  }

  if ($('.js_prod_big_slider').length) {
    const $slider_main = $('.js_prod_big_slider'),
      $slider_nav = $('.js_nav_gallery');

    $slider_main.slick({
      dots: true,
      appendDots: $('.prod-main__big-image .slider__dots'),
      infinite: true,
      prevArrow: $('.prod-main__big-image .slider__prev'),
      nextArrow: $('.prod-main__big-image .slider__next'),
      slidesToShow: 1,
      slidesToScroll: 1,
      swipeToSlide: true,
      asNavFor: '.js_nav_gallery',
    });

    $slider_nav.slick({
      dots: false,
      arrows: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      swipeToSlide: true,
      focusOnSelect: true,
      infinite: false,
      centerMode: false,
      variableWidth: false,
      asNavFor: '.js_prod_big_slider',
    });

    var nav_slick = $slider_nav.slick('getSlick');
    var slides_count = nav_slick.slideCount;
    var slides_to_show = nav_slick.options.slidesToShow;

    // если элементов не больше, чем отображается — правим поведение
    if (slides_count <= slides_to_show) {
      // удаляем transform, который Slick применяет при смене
      $slider_main.on('beforeChange', function (event, slick, current, next) {
        // убираем сдвиги у трека .slider_nav
        $slider_nav.find('.slick-track').css({
          transform: 'translate3d(0px, 0px, 0px)',
          transition: 'none',
        });

        // и просто обновляем активный класс
        $slider_nav.find('.slick-slide').removeClass('slick-current');
        $slider_nav.find('.slick-slide[data-slick-index="' + next + '"]').addClass('slick-current');
      });
    }
  }
}

function init_products_view() {
  const $view_toggle = $('.js_view');

  if (!$view_toggle.length) {
    return false;
  }

  const $list = $('.products__list');

  $view_toggle.on('click', function (evt) {
    evt.preventDefault();

    $list.toggleClass('list', $(this).data('view') === 'list');
    $view_toggle.removeClass('active');
    $(this).addClass('active');
  });
}

function init_tabs() {
  const $tabs = $('.js_tabs');

  if (!$tabs.length) {
    return false;
  }

  $tabs.tabs();
}

function init_popups() {
  const $toggles = $('.js_popup_toggle');

  if (!$toggles.length) {
    return false;
  }

  $toggles.on('click', function (evt) {
    evt.preventDefault();

    const $toggle = $(this),
      $popup = $toggle.next('.js_popup');

    if ($popup.is('.open')) {
      $popup.removeClass('open');
    } else {
      $popup.addClass('open');
    }
    $(document).on('click', function document_click_handler(evt) {
      if (
        !$(evt.target).is($popup) &&
        !$(evt.target).closest($popup).length &&
        !$(evt.target).is($toggle) &&
        !$(evt.target).closest($toggle).length
      ) {
        $popup.removeClass('open');
        $(document).off('click', document_click_handler);
      }
    });
  });
}

function init_range_sliders() {
  const $ranges = $('.js_range');

  if (!$ranges.length) {
    return false;
  }

  $ranges.each(function () {
    const $range = $(this),
      $block = $range.closest('.js_range_block'),
      $min_input = $block.find('.js_min_input'),
      $max_input = $block.find('.js_max_input');

    $range.slider({
      range: true,
      min: $range.data('min'),
      max: $range.data('max'),
      values: [$range.data('min'), $range.data('max')],
      slide: function (event, ui) {
        $min_input.val(ui.values[0]);
        $max_input.val(ui.values[1]);
      },
    });

    $min_input.val($range.slider('values', 0));
    $max_input.val($range.slider('values', 1));

    // Когда пользователь меняет минимальное значение
    $min_input.on('input change', function () {
      var min_val = parseInt($min_input.val(), 10);
      var max_val = parseInt($max_input.val(), 10);

      if (min_val > max_val) {
        min_val = max_val;
        $min_input.val(min_val);
      }

      $range.slider('values', 0, min_val);
    });

    // Когда пользователь меняет максимальное значение
    $max_input.on('input change', function () {
      var min_val = parseInt($min_input.val(), 10);
      var max_val = parseInt($max_input.val(), 10);

      if (max_val < min_val) {
        max_val = min_val;
        $max_input.val(max_val);
      }

      $range.slider('values', 1, max_val);
    });
  });
}

function init_show_password() {
  const $show_password = $('.js_show_password');

  if (!$show_password.length) {
    return false;
  }

  $show_password.on('click', function (e) {
    let $t = $(this),
      $p = $t.closest('.acc-form__password'),
      $passwordField = $p.find('input'),
      type = $passwordField.attr('type');
    if (type === 'password') {
      $passwordField.attr('type', 'text');
      $t.addClass('show');
      return;
    }
    $passwordField.attr('type', 'password');
    $t.removeClass('show');
  });
}

function init_accordion() {
  const $accordion = $('.faq__accordion');

  $(function () {
    $accordion.accordion({
      icons: false,
      collapsible: true,
      heightStyle: 'content',
    });
  });
}

function init_modals() {
  $.fn.modal = function (action) {
    return this.each(function () {
      var $modal = $(this);

      function show_modal() {
        $modal.fadeIn(0, function () {
          $modal.addClass('show');
        });
        $('body').addClass('modal_open'); // можно потом использовать для блокировки скролла
      }

      function hide_modal() {
        $modal.removeClass('show');
        setTimeout(function () {
          $modal.fadeOut(0);
          $('body').removeClass('modal_open');
        }, 300);
      }

      if (action === 'show') {
        show_modal();
      } else if (action === 'hide') {
        hide_modal();
      }

      // Поддержка кликов на кнопки и фон
      if (!$modal.data('modal_initialized')) {
        $modal.on('click', function (e) {
          if ($(e.target).is('.modal')) hide_modal();
        });
        $modal.on('click', '.close_modal_btn', hide_modal);
        $modal.data('modal_initialized', true);
      }
    });
  };

  // Открытие через data-атрибуты (bootstrap-стиль)
  $(document).on('click', '[data-toggle="modal"]', function (evt) {
    evt.preventDefault();
    var target = $(this).data('target');
    $(target).modal('show');
  });

  // Закрытие по Esc
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.modal.show').each(function () {
        $(this).modal('hide');
      });
    }
  });

  $(document).on('click', '.modal__close', function () {
    var $modal = $(this).closest('.modal');
    $modal.modal('hide');
  });

  if ($('.js_partner_signup').length) {
    $('.js_partner_signup').on('click', function () {
      const modal_id = $(this).data('target'),
        $modal = $(modal_id);

      if ($modal.length) {
        $modal.find('a[href="#partner"]').click();
        $modal.find('a[href="#partner_signup"]').click();
      }
    });
  }
}

$(document).ready(function () {
  init_menu();
  init_contact_form();
  init_modals();
  // init_custom_select();
  // init_map();
  init_sliders();
  init_products_view();
  init_tabs();
  init_popups();
  init_range_sliders();
  init_show_password();
  init_accordion();
});
