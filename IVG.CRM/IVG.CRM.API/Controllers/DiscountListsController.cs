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
    public class DiscountListsController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Discount Lists --

        #region -- Create discount list --

        [HttpPost]
        [Route("api/discount-lists")]
        public async Task<object> CreateDiscountList(tbl_DiscountLists entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist
                    var checkExist = await db.vw_DiscountLists
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
                        var item = new tbl_DiscountLists();

                        item.ID = id;
                        item.Name = entity.Name;
                        item.Type = entity.Type;
                        item.Status = 0;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = entity.CreatedBy;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = entity.ModifiedBy;

                        db.tbl_DiscountLists.Add(item);

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

        #region -- Get discount list --

        [HttpPost]
        [Route("api/discount-lists/list")]

        public async Task<object> GetDiscountList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_DiscountLists ";
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

        #region -- Get discount list details --

        [HttpGet]
        [Route("api/discount-lists/{id}")]

        public async Task<object> GetDiscountListDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkDiscountList = await db.vw_DiscountLists
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkDiscountList != null)
                    {
                        var rs = new
                        {
                            data = checkDiscountList,
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

        #region -- Get discount list by key --

        [HttpGet]
        [Route("api/discount-lists/auto-complete")]

        public async Task<object> GetDiscountListByKey(string key)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var query = await ExecSQLSync(" SELECT TOP 10 ID,Name " +
                        "FROM dbo.vw_DiscountLists WHERE Status = 1 AND Name " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'");

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

        #region -- Update discount list --

        [HttpPut]
        [Route("api/discount-lists")]
        public async Task<object> UpdateDiscountList(tbl_DiscountLists entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_DiscountLists
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
                        var checkDiscountList = await db.tbl_DiscountLists
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                        if (checkDiscountList != null)
                        {
                            checkDiscountList.Name = entity.Name;
                            checkDiscountList.Status = entity.Status;
                            checkDiscountList.ModifiedOn = DateTime.Now;
                            checkDiscountList.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete discount list --

        [HttpDelete]
        [Route("api/discount-lists")]

        public async Task<object> DeleteDiscountList(DeleteData data)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var checkDataUsing = await db.vw_PriceListItems.AnyAsync(x => x.DiscountListID == item);

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

                    await ExecSQLSync("DELETE dbo.tbl_DiscountLists WHERE ID IN (" + finalListID + ")");

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

        #region -- Discount List Items

        #region -- Create discount list item --

        [HttpPost]
        [Route("api/discount-lists/items")]
        public async Task<object> CreateDiscountListItem(tbl_DiscountListItems entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_DiscountListItems();

                    item.ID = id;
                    item.DiscountListID = entity.DiscountListID;
                    item.BeginQuantity = entity.BeginQuantity;
                    item.EndQuantity = entity.EndQuantity;
                    item.Amount = entity.Amount;
                    item.Percentage = entity.Percentage;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_DiscountListItems.Add(item);

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

        #region -- Get discount list item list --

        [HttpPost]
        [Route("api/discount-lists/items/list")]

        public async Task<object> GetDiscountListItemList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_DiscountListItems ";
                    string whereClause = " ID is not null ";

                    if (parameters.id != null)
                    {
                        whereClause += " AND DiscountListID = '" + parameters.id + "' ";
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

        #region -- Get discount list item details --

        [HttpGet]
        [Route("api/discount-lists/items/{id}")]

        public async Task<object> GetDiscountListItemDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkDiscountListItem = await db.vw_DiscountListItems
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkDiscountListItem != null)
                    {
                        var rs = new
                        {
                            data = checkDiscountListItem,
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

        #region -- Update discount list item --

        [HttpPut]
        [Route("api/discount-lists/items")]
        public async Task<object> UpdateDiscountListItem(tbl_DiscountListItems entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkDiscountListItem = await db.tbl_DiscountListItems
                        .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkDiscountListItem != null)
                    {
                        checkDiscountListItem.BeginQuantity = entity.BeginQuantity;
                        checkDiscountListItem.EndQuantity = entity.EndQuantity;
                        checkDiscountListItem.Amount = entity.Amount;
                        checkDiscountListItem.Percentage = entity.Percentage;
                        checkDiscountListItem.ModifiedOn = DateTime.Now;
                        checkDiscountListItem.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete discount list item --

        [HttpDelete]
        [Route("api/discount-lists/items")]

        public async Task<object> DeleteDiscountListItem(DeleteData data)
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

                    var exDelete = await ExecSQLSync("DELETE dbo.tbl_DiscountListItems" +
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
