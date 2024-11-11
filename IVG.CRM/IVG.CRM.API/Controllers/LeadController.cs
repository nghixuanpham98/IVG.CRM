using IVG.CRM.API.Areas.HelpPage.ModelDescriptions;
using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.UI.WebControls;
using static System.Net.WebRequestMethods;


namespace IVG.CRM.API.Controllers
{
    public class LeadController : ApiController
    {


        DBContext db = new DBContext();

        [HttpPost]
        [Route("api/Lead/List")]
        public IHttpActionResult List(AdvEntity param)
        {
            try
            {

                #region Params
                //param.EndTime = param.EndTime.AddDays(1);
                //param.EndTime = param.EndTime.AddSeconds(-1);
                //param.WhereClause = $" Start>='{param.StartTime.ToString("yyyy-MM-dd HH:mm:ss")}' AND Start<='{param.EndTime.ToString("yyyy-MM-dd HH:mm:ss")}' ";
                //if (param.Direction.HasValue && param.Direction.Value > 0)
                //{
                //    param.WhereClause += !string.IsNullOrEmpty(param.WhereClause) ? " AND " : "";
                //    param.WhereClause += $" Type={param.Direction} ";
                //}

                //if (param.IsExport)
                //{
                //    param.PageSize = 0;
                //}
                #endregion

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



        [HttpGet]
        [Route("api/Lead/New")]
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
        [Route("api/Lead/NewContactAccount")]
        public IHttpActionResult NewContactAccount(AdvEntity param)
        {
            try
            {
                if (param != null && param.Lead != null)
                {
                    var lead = param.Lead;
                    var accountId = Guid.Empty;
                    var contactId = Guid.NewGuid();
                    if (!string.IsNullOrEmpty(lead.Company))
                    {
                        accountId = Guid.NewGuid();
                        db.tbl_Accounts.Add(new tbl_Accounts
                        {
                            ID = accountId,
                            Name = lead.Company,
                            MainPhone = lead.MainPhone,
                            OtherPhone = lead.OtherPhone,
                            CreatedBy = lead.CreatedBy,
                            CreatedOn = lead.CreatedOn,
                            Email = lead.Email,
                            OwnerID = lead.OwnerID,
                            Address = lead.Address,
                            ProvinceID = lead.ProvinceID,
                            DistrictID = lead.DistrictID,
                            WardID = lead.WardID,
                            Website = lead.Website,
                            Description = lead.Description,
                        });
                    }

                    db.tbl_Contacts.Add(new tbl_Contacts
                    {
                        ID = contactId,
                        FirstName = lead.FirstName,
                        LastName = lead.LastName,
                        JobTitle = lead.JobTitle,
                        AccountID = accountId,
                        MainPhone = lead.MainPhone,
                        OtherPhone = lead.OtherPhone,
                        CreatedBy = lead.CreatedBy,
                        CreatedOn = lead.CreatedOn,
                        Email = lead.Email,
                        OwnerID = lead.OwnerID,
                        Address = lead.Address,
                        ProvinceID = lead.ProvinceID,
                        DistrictID = lead.DistrictID,
                        WardID = lead.WardID,
                        Description = lead.Description,
                    });

                    db.SaveChanges();

                    return Json(new { AccountID = accountId, ContactID = contactId });
                }

                return Json(new { Success = DAOLanguage.EN.alert_update_success });

            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }


        [HttpPost]
        [Route("api/Lead/Detail")]
        public IHttpActionResult Detail(AdvEntity param)
        {
            try
            {
                if (param != null && param.ID.HasValue)
                {
                    var Data = db.vw_Leads.FirstOrDefault(x => x.LeadID == param.ID.Value);
                    if (Data == null)
                    {
                        return Json(new { Error = DAOLanguage.EN.something_is_wrong_please_try_again });
                    }
                    var MasterData = new
                    {
                        Provinces = DAOMasterData.Provinces(),
                        Districts = DAOMasterData.Districts(Data.ProvinceID),
                        Wards = DAOMasterData.Wards(Data.ProvinceID, Data.DistrictID),
                        LeadStatus = DAOMasterData.EntityStatus.LeadStatus(),
                        LeadSource = DAOMasterData.OptionSet.LeadSource(),
                        DisqualifyStatus = DAOMasterData.EntityStatus.LeadStatusReason(3),
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


        void update_lead(tbl_Leads pr, ref Guid id, ref string error)
        {
            try
            {

                var ent = db.tbl_Leads.FirstOrDefault(x => x.ID == pr.ID);

                var isAdd = false;

                if (ent == null)
                {
                    isAdd = true;
                    ent = new tbl_Leads();
                    ent.ID = Guid.NewGuid();
                    ent.CreatedOn = DateTime.Now;
                    ent.CreatedBy = pr.ModifiedBy; /*get myid*/
                    ent.StatusID = 1;
                    ent.StatusReasonID = 1;
                    ent.OwnerID = pr.ModifiedBy; /* get myid | khi nào chuyển assign thì mới đổi ownerId này */
                }

                ent.Topic = pr.Topic;
                ent.FirstName = pr.FirstName;
                ent.LastName = pr.LastName;
                ent.JobTitle = pr.JobTitle;
                ent.MainPhone = pr.MainPhone;
                ent.OtherPhone = pr.OtherPhone;
                ent.Email = pr.Email;
                ent.Company = pr.Company;
                ent.Website = pr.Website;
                ent.Address = pr.Address;
                ent.ProvinceID = pr.ProvinceID;
                ent.DistrictID = pr.DistrictID;
                ent.WardID = pr.WardID;
                ent.Description = pr.Description;
                ent.SourceID = pr.SourceID;

                ent.ModifiedOn = DateTime.Now;
                ent.ModifiedBy = pr.ModifiedBy;
                id = ent.ID;
                if (isAdd) db.tbl_Leads.Add(ent);

                db.SaveChanges();

            }
            catch (Exception ex)
            {
                error = ex.Message;
            }
        }


        void validate_data(tbl_Leads ent, ref string error)
        {
            try
            {
                if (ent != null)
                {
                    if (!string.IsNullOrEmpty(ent.Email) && !ent.Email.Contains(".") && !ent.Email.Contains("@"))
                    {
                        error = DAOLanguage.EN.alert_invalid_email;
                    }
                    if (!string.IsNullOrEmpty(ent.Website) && !ent.Website.Contains("."))
                    {
                        error = DAOLanguage.EN.alert_invalid_website;
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
        [Route("api/Lead/Update")]
        public IHttpActionResult Update(AdvEntity param)
        {
            string error = "";
            try
            {

                if (param != null)
                {
                    #region update information
                    if (param.Lead != null)
                    { 
                        validate_data(param.Lead, ref error);
                        if (!string.IsNullOrEmpty(error)) return Json(new { Error = error });

                        var ID = Guid.Empty;
                        update_lead(param.Lead, ref ID, ref error);

                        if (!string.IsNullOrEmpty(error))
                        {
                            return Json(new { Error = error });
                        }
                        else
                        {
                            return Json(new { ID, Success = DAOLanguage.EN.alert_update_success });
                        }
                    }
                    #endregion

                    #region reactive lead
                    else if (param.IsReactive && param.ID.HasValue)
                    {
                        var ent = db.tbl_Leads.FirstOrDefault(x => x.ID == param.ID);
                        if (ent != null)
                        {
                            ent.StatusID = 1;
                            ent.StatusReasonID = 1;
                            ent.ModifiedOn = DateTime.Now;
                            ent.ModifiedBy = param.MyID;

                            db.SaveChanges();
                        }
                        return Json(new { Success = DAOLanguage.EN.alert_update_success });
                    }
                    #endregion

                    #region disqualify
                    else if (param.IsDisqualified && param.ID.HasValue && param.IntID.HasValue)
                    {
                        var ent = db.tbl_Leads.FirstOrDefault(x => x.ID == param.ID);
                        if (ent != null)
                        {
                            ent.StatusID = 3;
                            ent.StatusReasonID = param.IntID;
                            ent.ModifiedOn = DateTime.Now;
                            ent.ModifiedBy = param.MyID;

                            db.SaveChanges();
                        }
                        return Json(new { Success = DAOLanguage.EN.alert_update_success });
                    }
                    #endregion

                    #region qualify lead => convert lead to account & contact
                    else if (param.IsQualifiedLead && param.ID.HasValue)
                    {
                        var ent = db.tbl_Leads.FirstOrDefault(x => x.ID == param.ID);

                        if (ent != null)
                        {

                            validate_data(ent, ref error);
                            if (!string.IsNullOrEmpty(error)) return Json(new { Error = error });

                            #region 1. trùng account/contact
                            string mainPhone = ent.MainPhone;
                            string otherPhone = ent.OtherPhone;
                            List<vw_Accounts> _account = null;
                            List<vw_Contacts> _contact = null;

                            //trùng company | website
                            if (!string.IsNullOrEmpty(ent.Company))
                            {
                                _account = db.vw_Accounts.Where(x => x.AccountName == ent.Company).ToList();
                            }

                            if (_account != null && !string.IsNullOrEmpty(ent.Website))
                            {
                                _account = db.vw_Accounts.Where(x => x.AccountName == ent.Company && x.Website == ent.Website).OrderBy(x => x.AccountName).ToList();
                            }

                            //trùng sđt | email
                            _contact = db.vw_Contacts.Where(x => x.MainPhone == ent.MainPhone || x.OtherPhone == ent.MainPhone).ToList();
                            if (_contact != null && !string.IsNullOrEmpty(ent.Email))
                            {
                                _contact = db.vw_Contacts.Where(x => (x.MainPhone == ent.MainPhone || x.OtherPhone == ent.MainPhone) && x.Email == ent.Email).OrderBy(x => x.FullName).ToList();
                            }

                            if ((_contact != null && _contact.Count > 0 && !param.ContactID.HasValue) || (_account != null && _account.Count > 0 && !param.AccountID.HasValue))
                            {
                                //nếu trùng thì return lại bảng để cho chọn
                                error = DAOLanguage.EN.alert_duplicate_keyword;

                                if(_contact != null && _contact.Count > 0 && !param.ContactID.HasValue)
                                {

                                }

                                return Json(new
                                {
                                    IsDuplicate = true,
                                    Account = _account,
                                    Contact = _contact,
                                    Error = error
                                });
                            }
                            #endregion

                            #region 2. convert to account and contact

                            else
                            {
                                var accountId = Guid.NewGuid();
                                var contactId = Guid.NewGuid();
                                var opportunityId = Guid.NewGuid();
                                bool isAddAccount = false;

                                if (param.AccountID.HasValue)
                                {
                                    accountId = param.AccountID.Value;
                                }
                                else isAddAccount = true;

                                //create new acccount
                                if (isAddAccount && !string.IsNullOrEmpty(ent.Company))
                                {
                                    db.tbl_Accounts.Add(new tbl_Accounts
                                    {
                                        ID = accountId,
                                        Name = ent.Company,
                                        Website = ent.Website,
                                        Email = ent.Email,
                                        Address = ent.Address,
                                        CreatedBy = param.MyID,
                                        CreatedOn = DateTime.Now,
                                        Description = ent.Description,
                                        DistrictID = ent.DistrictID,
                                        MainPhone = ent.MainPhone,
                                        OtherPhone = ent.OtherPhone,
                                        OwnerID = ent.OwnerID,
                                        ProvinceID = ent.ProvinceID,
                                        WardID = ent.WardID,
                                        IsActive = true,
                                    });
                                }


                                bool isAddContact = false;

                                if (param.ContactID.HasValue)
                                {
                                    contactId = param.ContactID.Value;
                                }
                                else isAddContact = true;

                                //create new contact
                                if (isAddContact)
                                {
                                    db.tbl_Contacts.Add(new tbl_Contacts
                                    {
                                        ID = contactId,
                                        FirstName = ent.FirstName,
                                        LastName = ent.LastName,
                                        Email = ent.Email,
                                        AccountID = accountId,
                                        Address = ent.Address,
                                        CreatedBy = param.MyID,
                                        CreatedOn = DateTime.Now,
                                        Description = ent.Description,
                                        DistrictID = ent.DistrictID,
                                        JobTitle = ent.JobTitle,
                                        MainPhone = ent.MainPhone,
                                        OtherPhone = ent.OtherPhone,
                                        OwnerID = ent.OwnerID,
                                        ProvinceID = ent.ProvinceID,
                                        WardID = ent.WardID,
                                        IsActive = true,
                                    });
                                }

                                if (isAddContact && isAddAccount)
                                {
                                    db.tbl_AccountContacts.Add(new tbl_AccountContacts
                                    {
                                        ID = Guid.NewGuid(),
                                        ContactID = contactId,
                                        AccountID = accountId,
                                        IsPrimary = true
                                    });
                                }

                                //new cơ hội bán hàng

                                db.tbl_Opportunities.Add(new tbl_Opportunities
                                {
                                    ID = opportunityId,
                                    ContactID = contactId,
                                    AccountID = accountId,
                                    LeadID = ent.ID,
                                    Topic = ent.Topic,
                                    CreatedBy = param.MyID,
                                    CreatedOn = DateTime.Now,
                                    Description = ent.Description,
                                    OwnerID = ent.OwnerID,
                                    StatusID = 1,
                                    StatusReasonID = 1,
                                });

                                //update lead
                                ent.StatusID = 2;
                                ent.StatusReasonID = 1;
                                ent.QualifiedBy = param.MyID;
                                ent.QualifiedOn = DateTime.Now;
                                ent.AccountID = accountId;
                                ent.ContactID = contactId;
                                ent.OpportunityID = opportunityId;

                                db.SaveChanges();

                            }
                            #endregion

                            return Json(new { Success = DAOLanguage.EN.alert_update_success });

                        }

                        return Json(new { Error = DAOLanguage.EN.alert_item_not_found });
                    }
                    #endregion

                    return Json(new { Error = DAOLanguage.EN.alert_try_again });
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
        [Route("api/Lead/Delete")]
        public IHttpActionResult Delete(AdvEntity param)
        {
            try
            {
                if (param != null && param.ID.HasValue)
                {
                    var ent = db.tbl_Leads.FirstOrDefault(x => x.ID == param.ID.Value);
                    if (ent == null)
                    {
                        return Json(new { Error = DAOLanguage.EN.alert_item_not_found });
                    }
                    db.tbl_Leads.Remove(ent);
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

    }
}
