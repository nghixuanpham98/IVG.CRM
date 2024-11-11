using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static IVG.CRM.API.Common.ApiResponse;
using static IVG.CRM.API.DAO.DAOCommon;
using static IVG.CRM.API.DAO.Functions;

namespace IVG.CRM.API.Controllers
{
    public class SubjectsController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Create subject --

        [HttpPost]
        [Route("api/subjects")]
        public async Task<object> CreateSubject(tbl_Subjects entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_Subjects();

                    item.ID = id;
                    item.ParentID = entity.ParentID;
                    item.Title = entity.Title;
                    item.Status = entity.Status;
                    item.Description = entity.Description;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_Subjects.Add(item);

                    await db.SaveChangesAsync();

                    var rs = new
                    {
                        code = Code.Success,
                        messVN = Language.VN.alertCreateDataSuccess,
                        messEN = Language.EN.alertCreateDataSuccess
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

        #region -- Get subject list --

        [HttpPost]
        [Route("api/subjects/list")]

        public async Task<object> GetSubjectList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (parameters.isAll != null)
                    {
                        var subjects = await db.vw_Subjects
                            .OrderBy(x => x.Title)
                            .ToListAsync();

                        var rs = new
                        {
                            data = subjects,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else
                    {
                        string Columns = " * ";
                        string TableOrView = " dbo.vw_Subjects ";
                        string whereClause = " ID is not null ";

                        if (!string.IsNullOrEmpty(parameters.keySearch))
                        {
                            whereClause += " AND ( Title " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
                                + "%' ) ";
                        }

                        var TotalPages = 1;
                        var TotalRecords = 0;

                        PagingStore(Columns, TableOrView, whereClause, "ModifiedOn", "DESC"
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

        #endregion
    }
}
