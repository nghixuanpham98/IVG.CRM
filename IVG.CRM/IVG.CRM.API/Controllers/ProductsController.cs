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
    public class ProductsController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Products --

        #region -- Create product --

        [HttpPost]
        [Route("api/products")]
        public async Task<object> CreateProduct(tbl_Products entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_Products
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
                        var item = new tbl_Products();
                        var code = await AutoGenerateCode(entity.ModifiedBy, "Products");

                        if (!string.IsNullOrEmpty(code))
                        {
                            item.ID = id;
                            item.ParentID = entity.ParentID;
                            item.UnitGroupID = entity.UnitGroupID;
                            item.UnitID = entity.UnitID;
                            item.PriceListID = entity.PriceListID;
                            item.SubjectID = entity.SubjectID;
                            item.Code = code;
                            item.Name = entity.Name;
                            item.Type = entity.Type;
                            item.ValidFrom = entity.ValidFrom;
                            item.ValidTo = entity.ValidTo;
                            item.Status = 0;
                            item.DecimalsSupported = entity.DecimalsSupported;
                            item.Description = entity.Description;
                            item.CreatedOn = DateTime.Now;
                            item.CreatedBy = entity.CreatedBy;
                            item.ModifiedOn = DateTime.Now;
                            item.ModifiedBy = entity.ModifiedBy;

                            db.tbl_Products.Add(item);

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

        #region -- Get product list --

        [HttpPost]
        [Route("api/products/list")]

        public async Task<object> GetProductList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_Products ";
                    string whereClause = " ID is not null ";

                    if (parameters.type != 100)
                    {
                        whereClause += " AND Type = " + parameters.type;
                    }

                    if (!string.IsNullOrEmpty(parameters.keySearch))
                    {
                        whereClause += " AND ( Name " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
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

        #region -- Get product details --

        [HttpGet]
        [Route("api/products/{id}")]

        public async Task<object> GetProductDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkProduct = await db.vw_Products
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkProduct != null)
                    {
                        var rs = new
                        {
                            data = checkProduct,
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

        #region -- Get product list by key --

        [HttpGet]
        [Route("api/products/auto-complete")]

        public async Task<object> GetProductListByKey(string key, int type)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var query = await ExecSQLSync(" SELECT TOP 10 ID,Code,Name " +
                        "FROM dbo.vw_Products WHERE Type = " + type + " AND Status = 1 AND Name " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'");

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

        #region -- Get product special list by key --

        [HttpGet]
        [Route("api/products/special/auto-complete")]

        public async Task<object> GetProductSpecialListByKey(string key, int type)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var a = " SELECT TOP 10 ID,UnitGroupID,Code,Name FROM dbo.vw_Products WHERE NOT Type = " + type
                        + " AND Status = 1 AND Name " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'";

                    var query = await ExecSQLSync(a);
                    
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

        #region -- Update product --

        [HttpPut]
        [Route("api/products")]
        public async Task<object> UpdateProduct(tbl_Products entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    // Check exist name
                    var checkExist = await db.vw_Products
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
                        var checkProduct = await db.tbl_Products
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                        if (checkProduct != null)
                        {
                            checkProduct.UnitGroupID = entity.UnitGroupID;
                            checkProduct.UnitID = entity.UnitID;
                            checkProduct.PriceListID = entity.PriceListID;
                            checkProduct.SubjectID = entity.SubjectID;
                            checkProduct.Name = entity.Name;
                            checkProduct.ValidFrom = entity.ValidFrom;
                            checkProduct.ValidTo = entity.ValidTo;
                            checkProduct.Status = entity.Status;
                            checkProduct.DecimalsSupported = entity.DecimalsSupported;
                            checkProduct.Description = entity.Description;
                            checkProduct.ModifiedOn = DateTime.Now;
                            checkProduct.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete product --

        [HttpDelete]
        [Route("api/products")]

        public async Task<object> DeleteProduct(DeleteData data)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var checkID = await db.vw_Products
                            .FirstOrDefaultAsync(x => x.ParentID == item);

                        if (checkID != null)
                        {
                            var rsa = new
                            {
                                code = Code.Invalid_ID,
                                messVN = Language.VN.alertDeleteDataFailed,
                                messEN = Language.EN.alertDeleteDataFailed
                            };

                            return rsa;
                        }
                        else
                        {
                            var ID = "'" + item + "'";
                            iDCalls.Add(ID);
                        }
                    }

                    var finalListID = string.Join(",", iDCalls);

                    await ExecSQLSync("DELETE dbo.tbl_Products WHERE ID IN (" + finalListID + ")");

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

        #region -- Product Bundles --

        #region -- Create product bundle item --

        [HttpPost]
        [Route("api/products/bundles")]
        public async Task<object> CreateProductBundle(tbl_ProductBundles entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_ProductBundles();

                    item.ID = id;
                    item.BundleID = entity.BundleID;
                    item.ProductID = entity.ProductID;
                    item.UnitID = entity.UnitID;
                    item.Quantity = entity.Quantity;
                    item.Required = entity.Required;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_ProductBundles.Add(item);

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

        #region -- Get product bundle list --

        [HttpPost]
        [Route("api/products/bundles/list")]

        public async Task<object> GetProductBundleList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_ProductBundles ";
                    string whereClause = " ID is not null ";

                    if (parameters.id != null)
                    {
                        whereClause += " AND BundleID = '" + parameters.id + "' ";
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

        #region -- Get product bundle details --

        [HttpGet]
        [Route("api/products/bundles/{id}")]

        public async Task<object> GetProductBundleDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkProductBundle = await db.vw_ProductBundles
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkProductBundle != null)
                    {
                        var rs = new
                        {
                            data = checkProductBundle,
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

        #region -- Update product bundle --

        [HttpPut]
        [Route("api/products/bundles")]
        public async Task<object> UpdateProductBundle(tbl_ProductBundles entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkProductBundle = await db.tbl_ProductBundles
                        .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkProductBundle != null)
                    {
                        checkProductBundle.ProductID = entity.ProductID;
                        checkProductBundle.Quantity = entity.Quantity;
                        checkProductBundle.Required = entity.Required;
                        checkProductBundle.ModifiedOn = DateTime.Now;
                        checkProductBundle.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete product bundle --

        [HttpDelete]
        [Route("api/products/bundles")]

        public async Task<object> DeleteProductBundle(DeleteData data)
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

                    var exDelete = await ExecSQLSync("DELETE dbo.tbl_ProductBundles" +
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

        #region -- Product Relationships --

        #region -- Create product relationship --

        [HttpPost]
        [Route("api/products/relationships")]
        public async Task<object> CreateProductRelationship(tbl_ProductRelationships entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_ProductRelationships();

                    item.ID = id;
                    item.ProductID = entity.ProductID;
                    item.RelatedID = entity.RelatedID;
                    item.Type = entity.Type;
                    item.Direction = entity.Direction;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    // Check Direction
                    if (entity.Direction == 2)
                    {
                        var id2 = Guid.NewGuid();
                        var item2 = new tbl_ProductRelationships();

                        item2.ID = id2;
                        item2.ProductID = entity.RelatedID;
                        item2.RelatedID = entity.ProductID;
                        item2.Type = entity.Type;
                        item2.Direction = entity.Direction;
                        item2.CreatedOn = DateTime.Now;
                        item2.CreatedBy = entity.CreatedBy;
                        item2.ModifiedOn = DateTime.Now;
                        item2.ModifiedBy = entity.ModifiedBy;

                        db.tbl_ProductRelationships.Add(item2);
                    }

                    db.tbl_ProductRelationships.Add(item);

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

        #region -- Get product relationship list --

        [HttpPost]
        [Route("api/products/relationships/list")]

        public async Task<object> GetProductRelationshipList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_ProductRelationships ";
                    string whereClause = " ID is not null ";

                    if (parameters.id != null)
                    {
                        whereClause += " AND ProductID = '" + parameters.id + "' ";
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

        #region -- Get product relationship details --

        [HttpGet]
        [Route("api/products/relationships/{id}")]

        public async Task<object> GetProductRelationshipDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkProductRelationship = await db.vw_ProductRelationships
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkProductRelationship != null)
                    {
                        var rs = new
                        {
                            data = checkProductRelationship,
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

        #region -- Update product relationship --

        [HttpPut]
        [Route("api/products/relationships")]
        public async Task<object> UpdateProductRelationship(tbl_ProductRelationships entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkProductRelationship = await db.tbl_ProductRelationships
                        .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkProductRelationship != null)
                    {
                        checkProductRelationship.Type = entity.Type;
                        checkProductRelationship.Direction = entity.Direction;
                        checkProductRelationship.ModifiedOn = DateTime.Now;
                        checkProductRelationship.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete product relationship --

        [HttpDelete]
        [Route("api/products/relationships")]

        public async Task<object> DeleteProductRelationship(DeleteData data)
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

                    var exDelete = await ExecSQLSync("DELETE dbo.tbl_ProductRelationships" +
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
