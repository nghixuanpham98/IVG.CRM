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
    public class PriceListsController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Price Lists --

        #region -- Create price list --

        [HttpPost]
        [Route("api/price-lists")]
        public async Task<object> CreatePriceList(tbl_PriceLists entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_PriceLists
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
                        var item = new tbl_PriceLists();

                        item.ID = id;
                        item.Name = entity.Name;
                        item.StartDate = entity.StartDate;
                        item.EndDate = entity.EndDate;
                        item.Status = 0;
                        item.Description = entity.Description;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = entity.CreatedBy;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = entity.ModifiedBy;

                        db.tbl_PriceLists.Add(item);

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

        #region -- Get price list --

        [HttpPost]
        [Route("api/price-lists/list")]

        public async Task<object> GetPriceList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_PriceLists ";
                    string whereClause = " ID is not null ";

                    if (parameters.type != 100)
                    {
                        whereClause += " AND Status = " + parameters.type;
                    }

                    if (!string.IsNullOrEmpty(parameters.keySearch))
                    {
                        whereClause += " AND ( Name " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
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

        #region -- Get price list details --

        [HttpGet]
        [Route("api/price-lists/{id}")]

        public async Task<object> GetPriceListDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkPriceList = await db.vw_PriceLists
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkPriceList != null)
                    {
                        var rs = new
                        {
                            data = checkPriceList,
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

        #region -- Get price list by key --

        [HttpGet]
        [Route("api/price-lists/auto-complete")]

        public async Task<object> GetPriceListByKey(string key)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var query = await ExecSQLSync(" SELECT TOP 10 ID,Name " +
                        "FROM dbo.vw_PriceLists WHERE Name " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'");

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

        #region -- Update price list --

        [HttpPut]
        [Route("api/price-lists")]
        public async Task<object> UpdatePriceList(tbl_PriceLists entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_PriceLists
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
                        var checkPriceList = await db.tbl_PriceLists
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                        if (checkPriceList != null)
                        {
                            checkPriceList.Name = entity.Name;
                            checkPriceList.StartDate = entity.StartDate;
                            checkPriceList.EndDate = entity.EndDate;
                            checkPriceList.Status = entity.Status;
                            checkPriceList.Description = entity.Description;
                            checkPriceList.ModifiedOn = DateTime.Now;
                            checkPriceList.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete price list --

        [HttpDelete]
        [Route("api/price-lists")]

        public async Task<object> DeletePriceList(DeleteData data)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var checkDataUsing = await db.vw_Products
                            .AnyAsync(x => x.PriceListID == item);

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
                    }

                    var finalListID = string.Join(",", iDCalls);

                    await ExecSQLSync("DELETE dbo.tbl_PriceLists WHERE ID IN (" + finalListID + ")");

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

        #region -- Price List Items --

        #region -- Create price list item --

        [HttpPost]
        [Route("api/price-lists/items")]
        public async Task<object> CreatePriceListItem(tbl_PriceListItems entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_PriceListItems();

                    item.ID = id;
                    item.ProductID = entity.ProductID;
                    item.PriceListID = entity.PriceListID;
                    item.UnitID = entity.UnitID;
                    item.DiscountListID = entity.DiscountListID;
                    item.Amount = entity.Amount;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_PriceListItems.Add(item);

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

        #region -- Get price list item list --

        [HttpPost]
        [Route("api/price-lists/items/list")]

        public async Task<object> GetPriceListItemList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_PriceListItems ";
                    string whereClause = " ID is not null ";

                    if (parameters.id != null)
                    {
                        whereClause += " AND ProductID = '" + parameters.id + "' OR PriceListID = '" + parameters.id + "' ";
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

        #region -- Get  price list item details --

        [HttpGet]
        [Route("api/price-lists/items/{id}")]

        public async Task<object> GetPriceListItemDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkPriceListItem = await db.vw_PriceListItems
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkPriceListItem != null)
                    {
                        var rs = new
                        {
                            data = checkPriceListItem,
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

        #region -- Update price list item --

        [HttpPut]
        [Route("api/price-lists/items")]
        public async Task<object> UpdatePriceListItem(tbl_PriceListItems entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkPriceListItem = await db.tbl_PriceListItems
                        .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkPriceListItem != null)
                    {
                        checkPriceListItem.ProductID = entity.ProductID;
                        checkPriceListItem.PriceListID = entity.PriceListID;
                        checkPriceListItem.UnitID = entity.UnitID;
                        checkPriceListItem.DiscountListID = entity.DiscountListID;
                        checkPriceListItem.Amount = entity.Amount;
                        checkPriceListItem.ModifiedOn = DateTime.Now;
                        checkPriceListItem.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete price list item --

        [HttpDelete]
        [Route("api/price-lists/items")]

        public async Task<object> DeletePriceListItem(DeleteData data)
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

                    var exDelete = await ExecSQLSync("DELETE dbo.tbl_PriceListItems" +
                        " WHERE ID IN (" + finalListID + ")");

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
