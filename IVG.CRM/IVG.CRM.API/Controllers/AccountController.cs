using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static IVG.CRM.API.Common.ApiResponse;
using static IVG.CRM.API.DAO.Functions;
using static IVG.CRM.API.DAO.DAOCommon;

namespace IVG.CRM.API.Controllers
{
    public class AccountController : ApiController
    {


        DBContext db = new DBContext();

        [HttpPost]
        [Route("api/Account/List")]
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
                 
                return Json(Output);

            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }
         
        [HttpGet]
        [Route("api/Account/New")]
        public IHttpActionResult New()
        {
            try
            {
                var Data = new
                {
                    Provinces = DAOMasterData.Provinces(),
                    LeadSource = DAOMasterData.OptionSet.LeadSource()
                };

                return Json(new { Data });

            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }



        [HttpPost]
        [Route("api/Account/Detail")]
        public IHttpActionResult Detail(AdvEntity param)
        {
            try
            {
                if (param != null && param.ID.HasValue)
                {
                    var Data = db.vw_Accounts.FirstOrDefault(x => x.AccountID == param.ID.Value);
                    if (Data == null)
                    {
                        return Json(new { Error = DAOLanguage.EN.something_is_wrong_please_try_again });
                    }
                    var ContactList = db.vw_Contacts.Where(x => x.AccountID == param.ID).OrderBy(x => x.FirstName).ToList();
                    var MasterData = new
                    {
                        Provinces = DAOMasterData.Provinces(),
                        Districts = DAOMasterData.Districts(Data.ProvinceID),
                        Wards = DAOMasterData.Wards(Data.ProvinceID, Data.DistrictID),
                        
                    };

                    return Json(new { Data, MasterData, ContactList });
                }
                return Json(new { Error = DAOLanguage.EN.alert_required_param });
            } 
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }


        [HttpPost]
        [Route("api/Account/Update")]
        public IHttpActionResult Update(AdvEntity param)
        {
            try
            {
                if (param != null && param.Account != null)
                {
                    var pr = param.Account;

                    var ent = db.tbl_Accounts.FirstOrDefault(x => x.ID == pr.AccountID);
                     
                    var isAdd = false;

                    if (ent == null)
                    {
                        isAdd = true;

                        ent = new tbl_Accounts();
                        ent.ID = Guid.NewGuid();
                        ent.CreatedOn = DateTime.Now;
                        ent.CreatedBy = pr.CreatedBy; /*get myid*/
                        ent.OwnerID = pr.OwnerID; /*get myid*/
                    }

                    ent.Name = pr.AccountName;
                    ent.MainPhone = pr.MainPhone;
                    ent.OtherPhone = pr.OtherPhone;
                    ent.Email = pr.Email;
                    ent.Website = pr.Website;
                    ent.Address = pr.Address;
                    ent.ProvinceID = pr.ProvinceID;
                    ent.DistrictID = pr.DistrictID;
                    ent.WardID = pr.WardID;
                    ent.Description = pr.Description;

                    ent.ModifiedOn = DateTime.Now;
                    ent.ModifiedBy = pr.ModifiedBy;

                    if (isAdd) db.tbl_Accounts.Add(ent);

                    db.SaveChanges();

                    return Json(new { Success = DAOLanguage.EN.alert_update_success });

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
        [Route("api/Account/Delete")]
        public IHttpActionResult Delete(AdvEntity param)
        {
            try
            {
                if (param != null && param.ID.HasValue)
                {
                    var ent = db.tbl_Accounts.FirstOrDefault(x => x.ID == param.ID.Value);
                    if (ent == null)
                    {
                        return Json(new { Error = DAOLanguage.EN.alert_item_not_found });
                    }
                    db.tbl_Accounts.Remove(ent);
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



        #region -- Get account list by key --

        [HttpGet]
        [Route("api/accounts/auto-complete")]

        public async Task<object> GetAccountListByKey(string key)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var query = await ExecSQLSync(" SELECT TOP 10 AccountID AS ID, AccountName AS Name, MainPhone, Email " +
                        "FROM dbo.vw_Accounts WHERE AccountName " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'");

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
