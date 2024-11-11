using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using static IVG.CRM.API.Common.ApiResponse;
using static IVG.CRM.API.DAO.Functions;
using static IVG.CRM.API.DAO.DAOCommon;
using System.Data;
using System.Data.Entity;

namespace IVG.CRM.API.Controllers
{
    public class ContactController : ApiController
    {


        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        [HttpPost]
        [Route("api/Contact/List")]
        public IHttpActionResult List(AdvEntity param)
        {
            try
            { 
                string error = "";

                PagingEntity paging = new PagingEntity();

                var Data = DAOCommon.Database.Paging(param, ref paging, ref error);


                if (!string.IsNullOrEmpty(error))
                {
                    return Json(new { Error = error });
                }
                var Output = new
                {
                    Data,
                    Paging = paging,
                };

                #region MyRegion
                //if (param.IsExport && Output != null && Output.Data != null)
                //{
                //    Output.Data.Columns.Remove("Type");
                //    Output.Data.Columns.Remove("SiteID");
                //    Output.Data.Columns.Remove("RecordingFile");
                //    Output.Data.Columns.Remove("Start");
                //    Output.Data.Columns.Remove("ConnectTime");
                //    Output.Data.Columns.Remove("DisconnectTime");
                //    Output.Data.Columns["ID"].ColumnName = "No.";
                //    Output.Data.Columns["Direction"].ColumnName = "Direction";
                //    Output.Data.Columns["StartTimeDT"].ColumnName = "Start Time";
                //    Output.Data.Columns["ConnectTimeDT"].ColumnName = "Connect Time";
                //    Output.Data.Columns["DisconnectTimeDT"].ColumnName = "Disconnect Time";
                //    Output.Data.Columns["Duration"].ColumnName = "Duration";
                //    Output.Data.Columns["CallingNumber"].ColumnName = "Calling Number";
                //    Output.Data.Columns["CalledNumber"].ColumnName = "Called Number";
                //    Output.Data.Columns["ConnectNumber"].ColumnName = "Connect Number";
                //    Output.Data.Columns["CallingUser"].ColumnName = "Calling User";
                //    var Data = DAOCommon.ExportToExcelFile(Output.Data, ref error);
                //    var FileName = $"History {DateTime.Now.ToString("dd_MM_yyyy")}.xlsx";
                //    if (!string.IsNullOrEmpty(error))
                //    {
                //        return Json(new { Error = error });
                //    }
                //    return Json(new { FileName, Data });
                //}
                #endregion

                return Json(Output);

            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }


        [HttpPost]
        [Route("api/Contact/ListByID")]
        public IHttpActionResult ListByID(AdvEntity param)
        {
            try
            {
                if (param != null && param.AccountID.HasValue)
                {
                    var Data = db.vw_Contacts.Where(x => x.AccountID == param.AccountID).OrderBy(x => x.FirstName).ToList();
                    return Json(new { Data });
                }
                return Json(new { });
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }



        [HttpGet]
        [Route("api/Contact/New")]
        public IHttpActionResult New()
        {
            try
            {
                var Data = new
                {
                    Provinces = DAOMasterData.Provinces() 
                };

                return Json(new { Data });

            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }


        [HttpPost]
        [Route("api/Contact/Detail")]
        public IHttpActionResult Detail(AdvEntity param)
        {
            try
            { 
                if (param != null && param.ID.HasValue)
                {
                    var Data = db.vw_Contacts.FirstOrDefault(x => x.ContactID == param.ID.Value);
                    if (Data == null)
                    {
                        return Json(new { Error = DAOLanguage.EN.something_is_wrong_please_try_again });
                    }
                    var MasterData = new
                    {
                        Provinces = DAOMasterData.Provinces(),
                        Districts = DAOMasterData.Districts(Data.ProvinceID),
                        Wards = DAOMasterData.Wards(Data.ProvinceID, Data.DistrictID),
                    };

                    return Json(new { Data, MasterData });
                }
                return Json(new { Error = DAOLanguage.EN.alert_required_param });
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }

        void validate_data(tbl_Contacts ent, ref string error)
        {
            try
            {
                if (ent != null)
                {
                    if (!string.IsNullOrEmpty(ent.Email) && !ent.Email.Contains(".") && !ent.Email.Contains("@"))
                    {
                        error = DAOLanguage.EN.alert_invalid_email;
                    } 
                    if (!string.IsNullOrEmpty(ent.MainPhone) && (!DAOCommon.IsNumeric(ent.MainPhone) || ent.MainPhone.Length < 10))
                    {
                        error = DAOLanguage.EN.alert_invalid_phone;
                    }
                    if (!string.IsNullOrEmpty(ent.OtherPhone) && (!DAOCommon.IsNumeric(ent.OtherPhone) || ent.OtherPhone.Length < 10))
                    {
                        error = DAOLanguage.EN.alert_invalid_phone;
                    }
                }
            }
            catch (Exception ex)
            {
                error = ex.Message;
            }
        }



        [HttpPost]
        [Route("api/Contact/Update")]
        public IHttpActionResult Update(AdvEntity param)
        {
            string error = "";
            try
            {

                if (param != null && param.Contact != null)
                {
                    var ID = Guid.Empty;
                    var pr = param.Contact;
                    var ent = db.tbl_Contacts.FirstOrDefault(x => x.ID == pr.ContactID);

                    validate_data(ent, ref error);
                    if (!string.IsNullOrEmpty(error)) return Json(new { Error = error });

                    var isAdd = false;

                    if (ent == null)
                    {
                        isAdd = true;
                        ent = new tbl_Contacts();
                        ent.ID = Guid.NewGuid();
                        ent.CreatedOn = DateTime.Now;
                        ent.CreatedBy = pr.ModifiedBy; /*get myid*/
                        ent.OwnerID = pr.ModifiedBy; /* get myid | khi nào chuyển assign thì mới đổi ownerId này */
                        ent.AccountID = pr.AccountID;
                    }

                    //check trùng sđt
                    var isExited = db.tbl_Contacts.Any(x => x.ID != pr.ContactID && (x.MainPhone == pr.MainPhone || x.OtherPhone == pr.MainPhone));
                    if (!isExited && !string.IsNullOrEmpty(pr.OtherPhone))
                    {
                        isExited = db.tbl_Contacts.Any(x => x.ID != ent.ID && (x.MainPhone == pr.OtherPhone || x.OtherPhone == pr.OtherPhone));
                    }
                    if (isExited) return Json(new { Error = DAOLanguage.EN.alert_duplicate_phone });

                    ent.FirstName = pr.FirstName;
                    ent.LastName = pr.LastName;
                    ent.JobTitle = pr.JobTitle;
                    ent.MainPhone = pr.MainPhone;
                    ent.OtherPhone = pr.OtherPhone;
                    ent.Email = pr.Email;
                    ent.Address = pr.Address;
                    ent.ProvinceID = pr.ProvinceID;
                    ent.DistrictID = pr.DistrictID;
                    ent.WardID = pr.WardID;
                    ent.Description = pr.Description;

                    ent.ModifiedOn = DateTime.Now;
                    ent.ModifiedBy = pr.ModifiedBy;

                    if (isAdd) db.tbl_Contacts.Add(ent);
                    ID = ent.ID;
                    db.SaveChanges();

                    return Json(new { ID, pr.AccountID, Success = DAOLanguage.EN.alert_update_success });

                }
                else /*parameter is null*/
                {
                    return Json(new { Error = DAOLanguage.EN.alert_required_param });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }

        [HttpPost]
        [Route("api/Contact/Delete")]
        public IHttpActionResult Delete(AdvEntity param)
        {
            try
            {
                if (param != null && param.ID.HasValue)
                {
                    var ent = db.tbl_Contacts.FirstOrDefault(x => x.ID == param.ID.Value);
                    if (ent == null)
                    {
                        return Json(new { Error = DAOLanguage.EN.alert_item_not_found });
                    }
                    db.tbl_Contacts.Remove(ent);
                    db.SaveChanges();

                    string error = "";
                    DAOMasterData.DeleteFolderByEntityID(ent.ID, ref error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        return Json(new { Error = error });
                    }
                    return Json(new { Success = DAOLanguage.EN.alert_delete_success });
                }
                return Json(new { Success = DAOLanguage.EN.alert_required_param }); 
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }


        [HttpPost]
        [Route("api/Contact/Import")]
        public IHttpActionResult Import(AdvEntity param)
        {
            try
            {
                if (param != null && param.ID.HasValue)
                {


                    return Json(new { });
                }
                return Json(new { Error = DAOLanguage.EN.alert_required_param });
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }


        #region -- Get contact list --

        [HttpPost]
        [Route("api/contacts/list")]

        public async Task<object> GetContactList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (parameters.isAll != null)
                    {
                        var contactList = await db.vw_Contacts
                            .Where(x => x.AccountID == parameters.id)
                            .OrderBy(x => x.FullName)
                            .ToListAsync();

                        var rs = new
                        {
                            data = contactList,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else
                    {
                        string Columns = " * ";
                        string TableOrView = " dbo.vw_Contacts ";
                        string whereClause = " ID is not null ";

                        if (!string.IsNullOrEmpty(parameters.keySearch))
                        {
                            whereClause += " AND ( FullName " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
                                + "%' ) ";
                        }

                        var TotalPages = 1;
                        var TotalRecords = 0;

                        PagingStore(Columns, TableOrView, whereClause
                            , parameters.orderName, parameters.orderType
                            , parameters.pageNumber, parameters.pageSize
                            , ref TotalPages, ref TotalRecords, ref dataResult);

                        Paggin pagin = new Paggin();

                        pagin.PageIndex = parameters.pageNumber;
                        pagin.PageSize = parameters.pageSize;
                        pagin.TotalPages = TotalPages;
                        pagin.TotalRecords = TotalRecords;

                        var rs = new
                        {
                            data = dataResult,
                            paging = pagin,
                            code = Code.Success
                        };

                        return rs;
                    }
                }
                else
                {
                    var rs = new
                    {
                        code = Code.Invalid_Token,
                        messVN = Language.VN.alertInvalidToken,
                        messEN = Language.EN.alertInvalidToken
                    };

                    return Ok(rs);
                }
            }
            catch (Exception ex)
            {
                var rs = new
                {
                    err = ex.Message,
                    code = Code.Exception,
                    messVN = Language.VN.alertException,
                    messEN = Language.EN.alertException
                };

                return Ok(rs);
            }
        }

        #endregion

        #region -- Get contact list by key --

        [HttpGet]
        [Route("api/contacts/auto-complete")]

        public async Task<object> GetContactListByKey(string key)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var query = await ExecSQLSync(" SELECT TOP 10 ContactID AS ID, FullName AS Name " +
                        "FROM dbo.vw_Contacts WHERE FullName " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'");

                    var rs = new
                    {
                        data = query,
                        code = Code.Success
                    };

                    return rs;
                }
                else
                {
                    var rs = new
                    {
                        code = Code.Invalid_Token,
                        messVN = Language.VN.alertInvalidToken,
                        messEN = Language.EN.alertInvalidToken
                    };

                    return rs;
                }
            }
            catch (Exception ex)
            {
                var rs = new
                {
                    err = ex.Message,
                    code = Code.Exception,
                    messVN = Language.VN.alertException,
                    messEN = Language.EN.alertException
                };

                return rs;
            }
        }

        #endregion




    }
}
