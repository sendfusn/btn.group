# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :features, :head_description, :head_image, :head_link, :head_title, :logo_cloudinary_public_id

  # === CALLBACKS ===
  before_action :authenticate_admin_user!, only: :arbitrage
  before_action :configure_permitted_parameters, if: :devise_controller?

  def arbitrage
    @head_title = 'Arbitrage | btn.group'
  end

  def brand_assets
    @show_footer = true
  end

  def home
    @show_footer = true
  end

  def roadmap
    @show_footer = true
  end

  def features
    {
      near: {
        cloudinary_public_id: 'logos/icon_nm_yirtpt',
        name: 'Near',
        features: {
          smart_contract_interface: {
            name: 'Smart contract interface',
            show_in_navbar: true,
            show_link: true,
            status: 'Live'
          }
        }
      },
      secret_network: {
        cloudinary_public_id: 'logos/external-content.duckduckgo_s4rezw',
        name: 'Secret network',
        features: {
          address_alias: {
            name: 'Address alias',
            show_in_navbar: true,
            show_link: true,
            status: 'Live',
            contracts: {
              production: 'secret19993tt7657ljrzt27dh8wm7kxfedgezyuva96w'
            }
          },
          block_locker: {
            name: 'Block locker',
            show_in_navbar: true,
            show_link: true,
            status: 'Live',
            contracts: {
              production: 'secret1dww8fs5xlj6es5vwyp7ccgm4xclkmhxajxfaqa'
            }
          },
          buttcoin: {
            name: 'Buttcoin (BUTT)',
            show_in_navbar: true,
            show_link: true,
            status: 'Live',
            contracts: {
              production: 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt'
            }
          },
          butt_lode: {
            name: 'BUTT lode',
            show_in_navbar: true,
            show_link: true,
            status: 'Live',
            contracts: {
              production: 'secret1l9msv9yu7mgxant4stu89p0hqugz6j2frj7ne5'
            }
          },
          button_swap: {
            name: 'Button Swap',
            show_in_navbar: true,
            show_link: true,
            status: 'Live',
            contracts: {
              production: 'secret14qvf0dltj7ugdtcuvpd20323k5h4wpd905ssud'
            }
          },
          mount_doom: {
            name: 'Mount Doom',
            show_in_navbar: true,
            show_link: true,
            status: 'Live',
            contracts: {
              production: 'secret177e9pz4heqx3jtrxav3cqrq7jvp7uthhayk8uq'
            }
          },
          password_manager: {
            name: 'Password manager',
            show_in_navbar: true,
            show_link: true,
            status: 'Live',
            contracts: {
              production: 'secret1x56ls7efhdy8axktua0gzuc7muvgwnr98gh54j'
            }
          },
          pools: {
            name: 'Pools',
            show_in_navbar: true,
            show_link: true,
            status: 'Live'
          },
          smart_contract_interface: {
            name: 'Smart contract interface',
            show_in_navbar: true,
            show_link: true,
            status: 'Live'
          },
          transactions: {
            name: 'Transactions',
            show_in_navbar: true,
            show_link: true,
            status: 'Live'
          }
        }
      }
    }
  end

  def head_description
    'Buttcoin, block locker, yield optimizer and other blockchain solutions on the Secret and NEAR networks.'
  end

  def head_image
    'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,h_80/v1621228725/logos/btn_purple_background_uu2ere.png'
  end

  def head_link
    'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,dpr_2,f_auto,h_15,q_auto/v1/logos/btn_purple_background_uu2ere'
  end

  def head_title
    'btn.group'
  end

  def logo_cloudinary_public_id
    'logos/button.group_logo_ecemui'
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:otp_attempt])
  end
end
