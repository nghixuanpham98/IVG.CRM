using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Xml.Linq;
using static IVG.CRM.API.Common.ApiResponse;
using static IVG.CRM.API.DAO.DAOCommon;
using static IVG.CRM.API.DAO.Functions;

namespace IVG.CRM.API.Controllers
{
    public class CasesController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Cases --

        #region -- Create case --

        [HttpPost]
        [Route("api/cases")]
        public async Task<object> CreateCase(tbl_Cases entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_Cases();
                    var code = await AutoGenerateCode(entity.ModifiedBy, "Cases");

                    if (!string.IsNullOrEmpty(code))
                    {
                        item.ID = id;

                        if (entity.ParentID != null)
                        {
                            var checkParent = await db.vw_Cases
                                .FirstOrDefaultAsync(x => x.ID == entity.ParentID && x.ParentID == null);

                            if (checkParent != null)
                            {
                                item.ParentID = entity.ParentID;
                            }
                            else
                            {
                                var rs1 = new
                                {
                                    code = Code.Exception,
                                    messVN = Language.VN.alertDataUsing,
                                    messEN = Language.EN.alertDataUsing

                                };

                                return rs1;
                            }
                        }
                        
                        item.OwnerID = entity.OwnerID;
                        item.AccountID = entity.AccountID;
                        item.ContactID = entity.ContactID;
                        item.ProductID = entity.ProductID;
                        item.SubjectID = entity.SubjectID;
                        item.Code = code;
                        item.SerialNumber = entity.SerialNumber;
                        item.Title = entity.Title;
                        item.Origin = entity.Origin;
                        item.ServiceType = entity.ServiceType;
                        item.ServiceLevel = entity.ServiceLevel;
                        item.Priority = entity.Priority;
                        item.Status = 0;
                        item.StatusReason = entity.StatusReason;
                        item.Escalated = entity.Escalated;

                        if (entity.Escalated == true)
                        {
                            item.EscalatedOn = DateTime.Now;
                        }
                        else
                        {
                            item.EscalatedOn = null;
                        }

                        item.FollowUpBy = entity.FollowUpBy;
                        item.FirstResponseSent = entity.FirstResponseSent;
                        item.Description = entity.Description;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = entity.CreatedBy;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = entity.ModifiedBy;

                        db.tbl_Cases.Add(item);

                        await db.SaveChangesAsync();

                        var rs = new
                        {
                            data = id,
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
                            code = Code.Exception,
                            messVN = Language.VN.alertException,
                            messEN = Language.EN.alertException
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

        #region -- Get case list --

        [HttpPost]
        [Route("api/cases/list")]

        public async Task<object> GetCaseList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_Cases ";
                    string whereClause = " ID is not null ";

                    if (parameters.id != null)
                    {
                        whereClause += " AND OwnerID = '" + parameters.id + "' ";
                    }

                    if (parameters.accountID != null)
                    {
                        whereClause += " AND AccountID = '" + parameters.accountID + "' ";
                    }

                    if (parameters.parentID != null)
                    {
                        whereClause += " AND ParentID = '" + parameters.parentID + "' ";
                    }

                    if (parameters.type != 100)
                    {
                        whereClause += " AND Status = " + parameters.type;
                    }

                    if (!string.IsNullOrEmpty(parameters.keySearch))
                    {
                        whereClause += " AND ( Title " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
                            + "%' OR Code LIKE N'%" + parameters.keySearch
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
                        status = await DAOMasterData.EntityStatus.GetStatus(db, "cases"),
                        paging = pagin,
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

        #region -- Get case details --

        [HttpGet]
        [Route("api/cases/{id}")]

        public async Task<object> GetCaseDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkCase = await db.vw_Cases
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkCase != null)
                    {
                        var checkParent = await db.vw_Cases
                            .FirstOrDefaultAsync(x => x.ParentID == id);

                        if (checkParent != null)
                        {
                            var rs = new
                            {
                                data = checkCase,
                                isDad = true,
                                status = await DAOMasterData.EntityStatus.GetStatus(db, "cases"),
                                code = Code.Success
                            };

                            return rs;
                        }
                        else
                        {
                            var rs = new
                            {
                                data = checkCase,
                                isDad = false,
                                status = await DAOMasterData.EntityStatus.GetStatus(db, "cases"),
                                code = Code.Success
                            };

                            return rs;
                        }
                    }
                    else
                    {
                        var rs = new
                        {
                            code = Code.Invalid_ID,
                            messVN = Language.VN.alertIdDoesNotExist,
                            messEN = Language.EN.alertIdDoesNotExist
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

        #region -- Get case list by key --

        [HttpGet]
        [Route("api/cases/auto-complete")]

        public async Task<object> GetCaseListByKey(string key)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var query = await ExecSQLSync(" SELECT TOP 10 ID, Title AS Name " +
                        "FROM dbo.vw_Cases WHERE Title " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'");

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

        #region -- Update case --

        [HttpPut]
        [Route("api/cases")]
        public async Task<object> UpdateCase(tbl_Cases entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkCase = await db.tbl_Cases
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkCase != null)
                    {
                        if (entity.Status == 0)
                        {
                            if (entity.ParentID != null)
                            {
                                var checkParent = await db.tbl_Cases
                                    .FirstOrDefaultAsync(x => x.ID == entity.ParentID && x.ParentID == null);

                                if (checkParent != null)
                                {
                                    checkParent.ParentID = null;
                                    checkCase.ParentID = entity.ParentID;
                                }
                                else
                                {
                                    var rs1 = new
                                    {
                                        code = Code.Exception,
                                        messVN = Language.VN.alertDataUsing,
                                        messEN = Language.EN.alertDataUsing

                                    };

                                    return rs1;
                                }
                            }

                            checkCase.OwnerID = entity.OwnerID;
                            checkCase.AccountID = entity.AccountID;
                            checkCase.ContactID = entity.ContactID;
                            checkCase.ContractID = entity.ContractID;

                            if (entity.ContractLineID != null)
                            {
                                checkCase.ContractLineID = entity.ContractLineID;

                                // Check contract line
                                var checkContractLine = await db.tbl_ContractLines
                                    .FirstOrDefaultAsync(x => x.ID == entity.ContractLineID);

                                if (checkContractLine != null)
                                {
                                    if (checkContractLine.TotalCases > 0)
                                    {
                                        checkContractLine.TotalCases = checkContractLine.TotalCases - 1;
                                    }
                                }
                            }

                            checkCase.ProductID = entity.ProductID;
                            checkCase.SubjectID = entity.SubjectID;
                            checkCase.SerialNumber = entity.SerialNumber;
                            checkCase.Title = entity.Title;
                            checkCase.Origin = entity.Origin;
                            checkCase.ServiceType = entity.ServiceType;
                            checkCase.ServiceLevel = entity.ServiceLevel;
                            checkCase.Priority = entity.Priority;
                            checkCase.Status = entity.Status;
                            checkCase.StatusReason = entity.StatusReason;
                            checkCase.Escalated = entity.Escalated;

                            if (checkCase.EscalatedOn == null && entity.Escalated == true)
                            {
                                checkCase.EscalatedOn = DateTime.Now;
                            }

                            checkCase.FollowUpBy = entity.FollowUpBy;
                            checkCase.FirstResponseSent = entity.FirstResponseSent;
                            checkCase.Description = entity.Description;
                        }
                        else if (entity.Status == 1)
                        {
                            checkCase.Status = entity.Status;
                            checkCase.StatusReason = entity.StatusReason;
                            checkCase.ResolutionType = entity.ResolutionType;
                            checkCase.Resolution = entity.Resolution;
                            checkCase.ResolvedOn = DateTime.Now;
                            checkCase.ResolvedBy = entity.ResolvedBy;
                            checkCase.BillableTimeID = entity.BillableTimeID;
                            checkCase.Remarks = entity.Remarks;
                        }
                        else if (entity.Status == 2)
                        {
                            checkCase.Status = entity.Status;
                            checkCase.StatusReason = entity.StatusReason;
                            checkCase.CanceledOn = DateTime.Now;
                            checkCase.CanceledBy = entity.CanceledBy;
                        }
                        
                        checkCase.ModifiedOn = DateTime.Now;
                        checkCase.ModifiedBy = entity.ModifiedBy;

                        await db.SaveChangesAsync();

                        var rs = new
                        {
                            code = Code.Success,
                            messVN = Language.VN.alertUpdateDataSuccess,
                            messEN = Language.EN.alertUpdateDataSuccess
                        };

                        return rs;
                    }
                    else
                    {
                        var rs = new
                        {
                            code = Code.Invalid_ID,
                            messVN = Language.VN.alertIdDoesNotExist,
                            messEN = Language.EN.alertIdDoesNotExist
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

        #region -- Delete case --

        [HttpDelete]
        [Route("api/cases")]

        public async Task<object> DeleteCase(DeleteData data)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var ID = "'" + item + "'";
                        iDCalls.Add(ID);

                        var checkParent = await db.vw_Cases
                            .Where(x => x.ParentID == item)
                            .Select(x => x.ID)
                            .ToListAsync();

                        if (checkParent.Count > 0 && checkParent != null)
                        {
                            foreach(var itemMore in checkParent) 
                            {
                                var idMore = "'" + itemMore + "'";
                                iDCalls.Add(idMore);
                            }
                        }
                    }

                    var finalListID = string.Join(",", iDCalls);

                    await ExecSQLSync("DELETE dbo.tbl_Cases WHERE ID IN (" + finalListID + ")");

                    var rs = new
                    {
                        code = Code.Success,
                        messVN = Language.VN.alertDeleteDataSuccess,
                        messEN = Language.EN.alertDeleteDataSuccess

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

        #endregion

        #region -- Parent cases --

        #region -- Create parent case --

        [HttpPost]
        [Route("api/cases/parents")]
        public async Task<object> CreateParentCase(tbl_Cases entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkCase = await db.tbl_Cases
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkCase != null)
                    {
                        var checkParent = await db.vw_Cases
                                .FirstOrDefaultAsync(x => x.ID == entity.ParentID && x.ParentID == null);

                        if (checkParent != null && checkCase.ParentID == null)
                        {
                            checkCase.ParentID = entity.ParentID;
                        }
                        else
                        {
                            var rs1 = new
                            {
                                code = Code.Exception,
                                messVN = Language.VN.alertDataUsing,
                                messEN = Language.EN.alertDataUsing

                            };

                            return rs1;
                        }
                        checkCase.ModifiedOn = DateTime.Now;
                        checkCase.ModifiedBy = entity.ModifiedBy;

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
                            code = Code.Invalid_ID,
                            messVN = Language.VN.alertIdDoesNotExist,
                            messEN = Language.EN.alertIdDoesNotExist
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

        #region -- Delete parent case --

        [HttpDelete]
        [Route("api/cases/parents")]

        public async Task<object> DeleteParentCase(DeleteData data)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var ID = "'" + item + "'";
                        iDCalls.Add(ID);
                    }

                    var finalListID = string.Join(",", iDCalls);

                    await ExecSQLSync("DELETE dbo.tbl_Cases WHERE ID IN (" + finalListID + ")");

                    var rs = new
                    {
                        code = Code.Success,
                        messVN = Language.VN.alertDeleteDataSuccess,
                        messEN = Language.EN.alertDeleteDataSuccess

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

        #endregion

        #endregion
    }
}
