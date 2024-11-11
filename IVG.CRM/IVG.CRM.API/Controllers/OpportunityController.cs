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
    public class OpportunityController : ApiController
    {


        DBContext db = new DBContext();

        [HttpPost]
        [Route("api/Opportunity/List")]
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
        [Route("api/Opportunity/New")]
        public IHttpActionResult New()
        {
            try
            { 
                var MasterData = new
                {
                    Currency = DAOMasterData.OptionSet.Currency(),
                    PurchaseTimeframe = DAOMasterData.OptionSet.PurchaseTimeframe(),
                    PurchaseProcess = DAOMasterData.OptionSet.PurchaseProcess(),
                };

                return Json(new { MasterData });

            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }
          
        [HttpPost]
        [Route("api/Opportunity/Detail")]
        public IHttpActionResult Detail(AdvEntity param)
        {
            try
            {
                if (param != null && param.ID.HasValue)
                {
                    var Data = db.vw_Opportunities.FirstOrDefault(x => x.OpportunityID == param.ID.Value);
                    if (Data == null)
                    {
                        return Json(new { Error = DAOLanguage.EN.something_is_wrong_please_try_again });
                    }
                    var MasterData = new
                    {
                        Currency = DAOMasterData.OptionSet.Currency(),
                        PurchaseTimeframe = DAOMasterData.OptionSet.PurchaseTimeframe(),
                        PurchaseProcess = DAOMasterData.OptionSet.PurchaseProcess(),
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

        [HttpPost]
        [Route("api/Opportunity/Update")]
        public IHttpActionResult Update(AdvEntity param)
        {
            try
            {
                if (param != null && param.Opportunity != null)
                {
                    var ID = Guid.Empty;
                    var pr = param.Opportunity;
                    var ent = db.tbl_Opportunities.FirstOrDefault(x => x.ID == pr.OpportunityID);

                    var isAdd = false;

                    if (ent == null)
                    {
                        isAdd = true;
                        ent = new tbl_Opportunities();
                        ent.ID = Guid.NewGuid();
                        ent.CreatedOn = DateTime.Now;
                        ent.CreatedBy = pr.ModifiedBy; /*get myid*/
                        ent.OwnerID = pr.ModifiedBy; /* get myid | khi nào chuyển assign thì mới đổi ownerId này */
                        ent.StatusID = 1;
                        ent.StatusReasonID = 1;
                    }
                    ent.AccountID = pr.AccountID;
                    ent.ContactID = pr.ContactID;
                    ent.PurchaseTimeframeID = pr.PurchaseTimeframeID;
                    ent.Topic = pr.Topic;
                    ent.CurrencyID = pr.CurrencyID;
                    ent.BudgetAmount = pr.BudgetAmount;
                    ent.PurchaseProcessID = pr.PurchaseProcessID;
                    ent.CurrentSituation = pr.CurrentSituation;
                    ent.CustomerNeed = pr.CustomerNeed;
                    ent.ProposedSolution = pr.ProposedSolution;
                    ent.Description = pr.Description;
                    ent.EstimatedClosingDate = pr.EstimatedClosingDate;
                    ent.EstimatedRevenue = pr.EstimatedRevenue;
                    ent.ModifiedOn = DateTime.Now;
                    ent.ModifiedBy = pr.ModifiedBy;
                    ID = ent.ID;

                    if (isAdd) db.tbl_Opportunities.Add(ent);
                    db.SaveChanges();

                    return Json(new { ID, Success = DAOLanguage.EN.alert_update_success });
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
        [Route("api/Opportunity/Delete")]
        public IHttpActionResult Delete(AdvEntity param)
        {
            try
            {
                if (param != null && param.ID.HasValue)
                {
                    var ent = db.tbl_Opportunities.FirstOrDefault(x => x.ID == param.ID.Value);
                    if (ent == null)
                    {
                        return Json(new { Error = DAOLanguage.EN.alert_item_not_found });
                    }
                    db.tbl_Opportunities.Remove(ent);
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
