using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IVG.CRM.API.DAO
{
    public class DAOLanguage
    {
        public class EN
        {
            public static string alert_required_token = "Token field are required";
            public static string alert_required_uspw = "Username & Password are required";
            public static string alert_required_param = "Parameters are required";
            public static string alert_id_does_not_exist = "ID does not exist";
            public static string alert_sapcode_does_not_exist = "SAP Code does not exist";

            public static string alert_no_other_ext = "Not exists other Extension in your account";
            public static string alert_invalid_token = "Token is invalid or has expired";
            public static string alert_invalid_uspw = "Username & Password is invalid";
            public static string alert_invalid_phone = "Phone number is invalid";
            public static string alert_invalid_email = "Email is invalid";
            public static string alert_invalid_website = "Website is invalid";
            public static string alert_please_try_again_in_1_minute = "Please try again in 1 minute";
            public static string alert_account_locked = "Your account is locked, please contact the administrator";
            public static string alert_match_usip = "Username and IP address do not match";
            public static string alert_logged_by = "Your account is logged in by someone";
            public static string alert_logged = "The account has been logged in before";
            public static string alert_update_success = "Update successful";
            public static string alert_duplicate_item_success = "Duplicate item successful";

            public static string alert_request_equal_confirmed = "Error! Total Request Quantity EQUAL Confirmed Quantity";
            public static string alert_request_larger_confirmed = "Error! Total Request Quantity LARGER Confirmed Quantity";

            public static string alert_no_activity_screen_to_show = "No activity screen to show";
            public static string alert_upload_success = "Upload successful";
            public static string alert_create_success = "Create successful";
            public static string alert_delete_success = "Delete successful";
            public static string alert_question_in_use = "Question used";
            public static string alert_no_account_exists = "No login account exists";
            public static string alert_duplicate_username = "Duplicated user name";
            public static string alert_duplicate_category = "Duplicated category";
            public static string alert_duplicate_keyword = "Duplicated keyword";
            public static string alert_duplicate_account = "Duplicated account";
            public static string alert_duplicate_phone = "Duplicated phone number";

            public static string alert_save_failed = "Save failed";
            public static string alert_import_success = "Import successful";
            public static string alert_import_failed = "Import failed";
            public static string alert_agent_number_not_enough = "Agent Number is not enough";
            public static string alert_empty_keyword = "Empty keyword";

            public static string alert_import_format_pdf = "File upload request is PDF";

            public static string alert_import_format_incorrect = "Import file format is incorrect (*.xlsx or *.xls)";

            public static string alert_image_format_incorrect = "Image format is incorrect (*.jpg or *.png)";

            public static string alert_try_again = "Error! An error occurred. Please try again later.";
            public static string alert_no_data_to_download = "No data to download";
            public static string alert_no_data_to_add = "No data to add";
            public static string alert_no_data_to_update = "No data to update";
            public static string alert_no_data_to_delete = "No data to delete";
            public static string alert_select_agent_or_group = "Select agent or group to send notification";
            public static string alert_noti_send_success = "Successful message has been sent";
            public static string alert_mail_send_success = "Successful mail has been sent";
            public static string alert_required_fields_are_empty = "Required fields are empty";
            public static string alert_data_cannot_be_deleted = "Data cannot be deleted";
            public static string something_is_wrong_please_try_again = "Something is wrong please try again";
            public static string alert_case_number_does_not_exist = "Case number does not exist";
            public static string alert_reference_number_not_found = "Reference number not found";
            public static string alert_item_not_found = "Item not found";
            public static string alert_requested_item_is_not_selected = "Requested item is not selected";
        }
    }
}