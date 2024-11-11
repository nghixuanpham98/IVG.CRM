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
    public class UnitGroupsController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Unit Groups --

        #region -- Create unit group --

        [HttpPost]
        [Route("api/unit-groups")]
        public async Task<object> CreateUnitGroup(tbl_UnitGroups entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_UnitGroups
                        .AnyAsync(x => x.Name == entity.Name);

                    if (checkExist)
                    {
                        var rs1 = new
                        {
                            code = Code.Exception,
                            messVN = Language.VN.alertUsAlreadyExistedData,
                            messEN = Language.EN.alertUsAlreadyExistedData
                        };

                        return rs1;
                    }
                    else
                    {
                        var id = Guid.NewGuid();
                        var item = new tbl_UnitGroups();

                        item.ID = id;
                        item.Name = entity.Name;
                        item.PrimaryUnit = entity.PrimaryUnit;
                        item.Status = 0;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = entity.CreatedBy;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = entity.ModifiedBy;

                        db.tbl_UnitGroups.Add(item);

                        // Unit (Primary Unit)
                        var idUnit = Guid.NewGuid();
                        var itemUnit = new tbl_Units();

                        itemUnit.ID = idUnit;
                        itemUnit.ParentID = id;
                        itemUnit.BaseID = null;
                        itemUnit.Name = entity.PrimaryUnit;
                        itemUnit.Quantity = 1;
                        itemUnit.Status = entity.Status;
                        itemUnit.CreatedOn = DateTime.Now;
                        itemUnit.CreatedBy = entity.CreatedBy;
                        itemUnit.ModifiedOn = DateTime.Now;
                        itemUnit.ModifiedBy = entity.ModifiedBy;

                        db.tbl_Units.Add(itemUnit);

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

        #region -- Get unit group list --

        [HttpPost]
        [Route("api/unit-groups/list")]

        public async Task<object> GetUnitGroupList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (parameters.isAll != null)
                    {
                        var unitGroups = await db.vw_UnitGroups
                            .OrderBy(x => x.Name)
                            .ToListAsync();

                        var rs = new
                        {
                            data = unitGroups,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else {
                        string Columns = " * ";
                        string TableOrView = " dbo.vw_UnitGroups ";
                        string whereClause = " ID is not null ";

                        if (parameters.type != 100)
                        {
                            whereClause += " AND Status = " + parameters.type;
                        }

                        if (!string.IsNullOrEmpty(parameters.keySearch))
                        {
                            whereClause += " AND ( Name " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
                                + "%' OR PrimaryUnit " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
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

        #region -- Get unit group details --

        [HttpGet]
        [Route("api/unit-groups/{id}")]

        public async Task<object> GetUnitGroupDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkUnitGroup = await db.vw_UnitGroups
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkUnitGroup != null)
                    {
                        var rs = new
                        {
                            data = checkUnitGroup,
                            code = Code.Success
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

        #region -- Update unit group --

        [HttpPut]
        [Route("api/unit-groups")]
        public async Task<object> UpdateUnitGroup(tbl_UnitGroups entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_UnitGroups
                        .AnyAsync(x => x.Name == entity.Name && x.ID != entity.ID);

                    if (checkExist)
                    {
                        var rs1 = new
                        {
                            code = Code.Exception,
                            messVN = Language.VN.alertUsAlreadyExistedData,
                            messEN = Language.EN.alertUsAlreadyExistedData
                        };

                        return rs1;
                    }
                    else
                    {
                        var checkUnitGroup = await db.tbl_UnitGroups
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                        if (checkUnitGroup != null)
                        {
                            checkUnitGroup.Name = entity.Name;
                            checkUnitGroup.PrimaryUnit = entity.PrimaryUnit;
                            checkUnitGroup.Status = entity.Status;
                            checkUnitGroup.ModifiedOn = DateTime.Now;
                            checkUnitGroup.ModifiedBy = entity.ModifiedBy;

                            // Check unit
                            var checkUnit = await db.tbl_Units
                                .FirstOrDefaultAsync(x => x.ParentID == entity.ID && x.BaseID == null);

                            if (checkUnit != null)
                            {
                                checkUnit.Name = entity.PrimaryUnit;
                                checkUnit.Status = entity.Status;
                                checkUnit.ModifiedOn = DateTime.Now;
                                checkUnit.ModifiedBy = entity.ModifiedBy;
                            }

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

        #region -- Delete unit group --

        [HttpDelete]
        [Route("api/unit-groups")]

        public async Task<object> DeleteUnitGroup(DeleteData data)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var checkDataUsing = await db.vw_Products.AnyAsync(x => x.UnitGroupID == item);

                        if (checkDataUsing)
                        {
                            var rs1 = new
                            {
                                code = Code.Exception,
                                messVN = Language.VN.alertDataUsing,
                                messEN = Language.EN.alertDataUsing

                            };

                            return rs1;
                        }

                        var ID = "'" + item + "'";
                        iDCalls.Add(ID);

                        var checkUnit = await db.tbl_Units
                            .Where(x => x.ParentID == item).ToListAsync();

                        if (checkUnit != null && checkUnit.Count() > 0) {
                            foreach (var unit in checkUnit) {
                                db.tbl_Units.Remove(unit);
                                db.SaveChanges();
                            }
                        }
                    }

                    var finalListID = string.Join(",", iDCalls);

                    await ExecSQLSync("DELETE dbo.tbl_UnitGroups WHERE ID IN (" + finalListID + ")");

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

        #region -- Units --

        #region -- Create unit --

        [HttpPost]
        [Route("api/units")]
        public async Task<object> CreateUnit(tbl_Units entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_Units
                        .AnyAsync(x => x.Name == entity.Name);

                    if (checkExist)
                    {
                        var rs1 = new
                        {
                            code = Code.Exception,
                            messVN = Language.VN.alertUsAlreadyExistedData,
                            messEN = Language.EN.alertUsAlreadyExistedData
                        };

                        return rs1;
                    }
                    else
                    {
                        var id = Guid.NewGuid();
                        var item = new tbl_Units();

                        item.ID = id;
                        item.ParentID = entity.ParentID;
                        item.BaseID = entity.BaseID;
                        item.Name = entity.Name;
                        item.Quantity = entity.Quantity;
                        item.Status = 1;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = entity.CreatedBy;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = entity.ModifiedBy;

                        db.tbl_Units.Add(item);

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

        #region -- Get unit list --

        [HttpPost]
        [Route("api/units/list")]

        public async Task<object> GetUnitList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (parameters.isAll != null)
                    {
                        var units = await db.vw_Units
                            .Where(x => x.ParentID == parameters.id)
                            .OrderBy(x => x.Name)
                            .ToListAsync();

                        var rs = new
                        {
                            data = units,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else
                    {
                        string Columns = " * ";
                        string TableOrView = " dbo.vw_Units ";
                        string whereClause = " ID is not null ";

                        if (parameters.id != null)
                        {
                            whereClause += " AND ParentID = '" + parameters.id + "' ";
                        }

                        if (!string.IsNullOrEmpty(parameters.keySearch))
                        {
                            whereClause += " AND ( Name " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
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

        #region -- Get unit details --

        [HttpGet]
        [Route("api/units/{id}")]

        public async Task<object> GetUnitDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkUnit = await db.vw_Units
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkUnit != null)
                    {
                        var rs = new
                        {
                            data = checkUnit,
                            code = Code.Success
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

        #region -- Update unit --

        [HttpPut]
        [Route("api/units")]
        public async Task<object> UpdateUnit(tbl_Units entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_Units
                        .AnyAsync(x => x.Name == entity.Name && x.ID != entity.ID);

                    if (checkExist)
                    {
                        var rs1 = new
                        {
                            code = Code.Exception,
                            messVN = Language.VN.alertUsAlreadyExistedData,
                            messEN = Language.EN.alertUsAlreadyExistedData
                        };

                        return rs1;
                    }
                    else
                    {
                        var checkUnit = await db.tbl_Units
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                        if (checkUnit != null)
                        {
                            if (checkUnit.BaseID == null)
                            {
                                // Check unit group
                                var checkUnitGroup = await db.tbl_UnitGroups
                                    .FirstOrDefaultAsync(x => x.ID == entity.ParentID);

                                if (checkUnitGroup != null)
                                {
                                    checkUnitGroup.PrimaryUnit = entity.Name;
                                }
                            }

                            checkUnit.BaseID = entity.BaseID;
                            checkUnit.Name = entity.Name;
                            checkUnit.Quantity = entity.Quantity;
                            checkUnit.ModifiedOn = DateTime.Now;
                            checkUnit.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete unit --

        [HttpDelete]
        [Route("api/units")]

        public async Task<object> DeleteUnit(DeleteData data)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var checkUnit = await db.tbl_Units
                            .FirstOrDefaultAsync(x => x.ID == item && x.BaseID != null);

                        if (checkUnit != null)
                        {
                            var ID = "'" + item + "'";
                            iDCalls.Add(ID);
                        }
                    }

                    var finalListID = string.Join(",", iDCalls);

                    await ExecSQLSync("DELETE dbo.tbl_Units WHERE ID IN (" + finalListID + ")");

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
