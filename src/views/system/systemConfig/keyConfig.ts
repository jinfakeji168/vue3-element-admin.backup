export type TabNames =
    | "basicFeature"
    | "package"
    | "homeConfig"
    | "expense"
    | "collection"
    | "register"
    | "recharge"
    | "quantitationConfig"
    | "investmentConfig"
    | "shareConfig"
    | "securityConfig";

//用来区分每个配置tab所包含的值，方便改动监听和保存
export const keyMap: Record<TabNames, string[]> = {
    basicFeature: [
        'website_skin_style',
        'website_logo',
        'website_operator_icon',
        'website_name',
        'client_show_spread_level',
        'client_proxy_team_show_level',
        'client_user_team_count_time',
        'client_google_secret_status',
        'client_is_show_user_protocol',
        'client_invest_status',
        'client_system_default_lang_type',
        'client_system_default_lang',
        'client_system_default_phone_code',
        'client_salesmartly',
        'transfer_is_brokerage_to_basic',
        'transfer_is_basic_to_brokerage',
        'transfer_is_financial_to_basic',
        'transfer_is_brokerage_to_financial',
        'transfer_is_brokerage_to_contract',
        'transfer_is_contract_to_brokerage',
        'transfer_is_contract_to_basic',
        'transfer_transfer_out_ratio',
        'transfer_transfer_out_min',
        'transfer_transfer_out_max',
        'transfer_other_transfer_out_ratio',
        'transfer_other_transfer_out_min',
        'transfer_other_transfer_out_max',
        'voice_reminder_switch',
        'voice_is_repeat_extract_voice',
        'voice_recharge_voice_file',
        'voice_withdraw_voice_file',
    ],
    package: [
        'package_app_download_show_switch',
        'app_download_url'
    ],
    homeConfig: [
        "index_is_login",
        "index_force_notice",
        // "index_notice_content",
        "is_show_fake_data",
        "index_show_market_data",
        "index_video_is_show",
        "index_video_url",
        "home_top_tips_name",
        "home_top_tips_url",
        "white_paper_url",
        "index_user_income_min",
        "index_user_income_max",
        "index_profit_fake_num",
        "index_profit_fake_increase_low",
        "index_profit_fake_increase_up",
        "start_operation_time"
    ],
    expense: [
        "payment_wallet",
        "bep20_payment_wallet",
        "extract_switch",
        "recharge_num_is_withdrawal",
        "withdrawal_activation_type",
        "extract_num_day",
        "extract_address_channel",
        "is_change_withdrawal_address",
        "is_repeat_withdrawal_address",
        "extract_input_contact",
        "auto_payment",
        "auto_payment_safety_value",
        "min_extract_config",
        // "withdraw_instructions_settings",
        "free_fee_num",
        "extract_free_fee_type"
    ],
    collection: [
        'collection_wallet',
        'bep20_collection_wallet'
    ],
    register: [
        "is_register_message",
        "register_is_captcha",
        "is_repeat_password",
        "security_password_type",
        "register_account_status",
        "username_register_status",
        "username_register_email",
        "username_register_phone",
        "telegram_register_status",
        "tg_auto_login",
        "ip_register_limit",
        "ip_register_limit_type",
        "is_verify_email_code",
        "register_code_valid_time",
        "register_email_code_num",
        "register_give_money",
        "register_send_contract_money",
        "register_virtual_money",
        "is_need_spreader",
        "invite_link_type",
        "recharge_num_valid_user",
        "error_to_show_pic",
        "error_to_ban",
        "login_error_lock_time",
        "code_valid_time",
        "pwd_email_code_num"
    ],
    recharge: [
        "account_type_options",
        "vip_rebate_type",
        "recharge_rebate_account",
        "is_open_first_charge_rebate",
        "first_recharge_send_account",
        "first_recharge_config_type",
        "first_charge_rebate_min",
        "first_charge_rebate_percent",
        "first_charge_rebate_cap",
        "is_open_again_charge_rebate",
        "again_charge_rebate_min",
        "is_open_team_again_charge_rebate",
        "give_team_brokerage_account",
        "give_team_type",
        "team_recharge_spread_level",
        "give_team_brokerage_limit",
        "give_team_brokerage_num"
    ],
    quantitationConfig: [
        "task_show_income_type",
        "auto_unlock_level",
        "auto_is_upgrade_task",
        "quan_currency",
        "quan_time",
        "task_reset_type",
        "show_data_time",
        "quant_reset_time",
        "is_show_experience",
        "register_give_experience",
        "experience_validity_period",
        "experience_is_level",
        "recharge_empty_experience",
        "quan_income_probability_type",
        "task_brokerage_account",
        "is_upgrade_reset_task",
        "last_task_clear_level",
        "last_task_clear_level_type",
        "level_unlock_return_type",
        "is_distribute_task"
    ],
    investmentConfig: ['finance_capital_give_account'],
    shareConfig: ['is_auto_check'],
    securityConfig: [
        'update_money_google_secret',
        'edit_address_is_google',
        'extract_check_is_google_code',
        'update_banner_is_google',
        'update_logo_is_google',
    ]


}

