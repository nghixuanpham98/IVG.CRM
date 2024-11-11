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
    public class ContractsController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Contracts --

        #region -- Create contract --

        [HttpPost]
        [Route("api/contracts")]
        public async Task<object> CreateContract(tbl_Contracts entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_Contracts();
                    var code = await AutoGenerateCode(entity.ModifiedBy, "Contracts");

                    if (!string.IsNullOrEmpty(code))
                    {
                        item.ID = id;
                        item.OwnerID = entity.OwnerID;
                        item.AccountID = entity.AccountID;
                        item.Code = code;
                        item.Name = entity.Name;
                        item.ContractStartDate = entity.ContractStartDate;
                        item.ContractEndDate = entity.ContractEndDate;
                        item.DurationInDays = entity.DurationInDays;
                        item.DiscountType = entity.DiscountType;
                        item.ServiceLevel = entity.ServiceLevel;
                        item.Status = 0;
                        item.ContractProvinceID = entity.ContractProvinceID;
                        item.ContractDistrictID = entity.ContractDistrictID;
                        item.ContractWardID = entity.ContractWardID;
                        item.ContractAddress = entity.ContractAddress;
                        item.BillAccountID = entity.BillAccountID;
                        item.BillStartDate = entity.BillStartDate;
                        item.BillEndDate = entity.BillEndDate;
                        item.BillProvinceID = entity.BillProvinceID;
                        item.BillDistrictID = entity.BillDistrictID;
                        item.BillWardID = entity.BillWardID;
                        item.BillAddress = entity.BillAddress;
                        item.BillFrequency = entity.BillFrequency;
                        item.CancellationDate = entity.CancellationDate;
                        item.TotalPrice = 0;
                        item.TotalDiscount = 0;
                        item.NetPrice = 0;
                        item.Description = entity.Description;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = entity.CreatedBy;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = entity.ModifiedBy;

                        db.tbl_Contracts.Add(item);

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

        #region -- Get contract list --

        [HttpPost]
        [Route("api/contracts/list")]

        public async Task<object> GetContractList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (parameters.isAll != null)
                    {
                        var contractList = await db.vw_Contracts
                            .Where(x => x.AccountID == parameters.id)
                            .OrderBy(x => x.Name)
                            .ToListAsync();

                        var rs = new
                        {
                            data = contractList,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else
                    {
                        string Columns = " * ";
                        string TableOrView = " dbo.vw_Contracts ";
                        string whereClause = " ID is not null ";

                        if (parameters.id != null)
                        {
                            whereClause += " AND OwnerID = '" + parameters.id + "' ";
                        }

                        if (parameters.type != 100)
                        {
                            whereClause += " AND Status = " + parameters.type;
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

        #region -- Get contract details --

        [HttpGet]
        [Route("api/contracts/{id}")]

        public async Task<object> GetContractDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkContract = await db.vw_Contracts
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkContract != null)
                    {
                        var rs = new
                        {
                            data = checkContract,
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

        #region -- Get contract list by key --

        [HttpGet]
        [Route("api/contracts/auto-complete")]

        public async Task<object> GetContractListByKey(string key)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var query = await ExecSQLSync(" SELECT TOP 10 ID,Code,Name " +
                        "FROM dbo.vw_Contracts WHERE Name " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'");

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

        #region -- Update contract --

        [HttpPut]
        [Route("api/contracts")]
        public async Task<object> UpdateContract(tbl_Contracts entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkContract = await db.tbl_Contracts
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkContract != null)
                    {
                        if (checkContract.Status == 0 && entity.Status == 1)
                        {
                            var checkLine = await db.vw_ContractLines
                                .AnyAsync(x => x.ContractID == entity.ID);

                            if (checkLine == false)
                            {
                                var rs1 = new
                                {
                                    code = Code.Exception,
                                    messVN = Language.VN.alertInvalidContractLines,
                                    messEN = Language.EN.alertInvalidContractLines
                                };

                                return rs1;
                            }
                        }

                        checkContract.OwnerID = entity.OwnerID;
                        checkContract.AccountID = entity.AccountID;
                        checkContract.Name = entity.Name;
                        checkContract.ContractStartDate = entity.ContractStartDate;
                        checkContract.ContractEndDate = entity.ContractEndDate;
                        checkContract.DurationInDays = entity.DurationInDays;
                        checkContract.ServiceLevel = entity.ServiceLevel;
                        checkContract.Status = entity.Status;
                        checkContract.ContractProvinceID = entity.ContractProvinceID;
                        checkContract.ContractDistrictID = entity.ContractDistrictID;
                        checkContract.ContractWardID = entity.ContractWardID;
                        checkContract.ContractAddress = entity.ContractAddress;
                        checkContract.BillAccountID = entity.BillAccountID;
                        checkContract.BillStartDate = entity.BillStartDate;
                        checkContract.BillEndDate = entity.BillEndDate;
                        checkContract.BillFrequency = entity.BillFrequency;

                        if (entity.Status == 4)
                        {
                            checkContract.CancellationDate = DateTime.Now;
                        }

                        checkContract.BillProvinceID = entity.BillProvinceID;
                        checkContract.BillDistrictID = entity.BillDistrictID;
                        checkContract.BillWardID = entity.BillWardID;
                        checkContract.BillAddress = entity.BillAddress;
                        checkContract.Description = entity.Description;
                        checkContract.ModifiedOn = DateTime.Now;
                        checkContract.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete contract --

        [HttpDelete]
        [Route("api/contracts")]

        public async Task<object> DeleteContract(DeleteData data)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var checkStatus = await db.vw_Contracts
                            .FirstOrDefaultAsync(x => x.ID == item);

                        if (checkStatus != null && checkStatus.Status != 0 && checkStatus.Status != 4)
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

                    await ExecSQLSync("DELETE dbo.tbl_Contracts WHERE ID IN (" + finalListID + ")");

                    await ExecSQLSync("DELETE dbo.tbl_ContractLines WHERE ContractID IN (" + finalListID + ")");

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

        #region -- Contract lines --

        #region -- Create contract line --

        [HttpPost]
        [Route("api/contracts/lines")]
        public async Task<object> CreateContractLine(tbl_ContractLines entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkContract = db.tbl_Contracts
                        .FirstOrDefault(x => x.ID == entity.ContractID);

                    if (checkContract != null)
                    {
                        // Contract line
                        var id = Guid.NewGuid();
                        var item = new tbl_ContractLines();

                        var rate = Math.Round((decimal)(entity.TotalPrice / entity.TotalCases));

                        decimal net = 0;
                        decimal discount = 0;

                        if (entity.Discount != null && entity.PercentageDiscount == null)
                        {
                            discount += Math.Round((decimal)entity.Discount);
                        }
                        else if (entity.Discount == null && entity.PercentageDiscount != null)
                        {
                            discount += Math.Round((decimal)((entity.TotalPrice / 100) * entity.PercentageDiscount));
                        }

                        net = Math.Round((decimal)entity.TotalPrice - discount);

                        item.ID = id;
                        item.ContractID = entity.ContractID;
                        item.ProductID = entity.ProductID;
                        item.AccountID = entity.AccountID;
                        item.UnitID = entity.UnitID;
                        item.SerialNumber = entity.SerialNumber;
                        item.Title = entity.Title;
                        item.StartDate = entity.StartDate;
                        item.EndDate = entity.EndDate;
                        item.Quantity = entity.Quantity;
                        item.Rate = rate;
                        item.TotalPrice = entity.TotalPrice;
                        item.Discount = entity.Discount;
                        item.PercentageDiscount = entity.PercentageDiscount;
                        item.TotalDiscount = discount;
                        item.Net = net;
                        item.TotalCases = entity.TotalCases;
                        item.Used = 0;
                        item.Remaining = entity.TotalCases;
                        item.ProvinceID = entity.ProvinceID;
                        item.DistrictID = entity.DistrictID;
                        item.WardID = entity.WardID;
                        item.Location = entity.Location;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = entity.CreatedBy;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = entity.ModifiedBy;

                        db.tbl_ContractLines.Add(item);


                        // Update Contract
                        var totalPrice = checkContract.TotalPrice + entity.TotalPrice;
                        var netPrice = checkContract.NetPrice + net;
                        var totalDiscount = checkContract.TotalDiscount + discount;

                        checkContract.TotalPrice = totalPrice;
                        checkContract.TotalDiscount = totalDiscount;
                        checkContract.NetPrice = netPrice;
                        checkContract.ModifiedOn = DateTime.Now;
                        checkContract.ModifiedBy = entity.ModifiedBy;

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

        #region -- Get contract line list --

        [HttpPost]
        [Route("api/contracts/lines/list")]

        public async Task<object> GetContractLineList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (parameters.isAll != null)
                    {
                        var contractLines = await db.vw_ContractLines
                                .Where(x => x.ContractID == parameters.id)
                                .OrderBy(x => x.Title)
                                .ToListAsync();

                        var rs = new
                        {
                            data = contractLines,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else {
                        string Columns = " * ";
                        string TableOrView = " dbo.vw_ContractLines ";
                        string whereClause = " ID is not null ";

                        if (parameters.id != null)
                        {
                            whereClause += " AND ContractID = '" + parameters.id + "' ";
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

        #region -- Get contract line details --

        [HttpGet]
        [Route("api/contracts/lines/{id}")]

        public async Task<object> GetContractLineDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkContractLine = await db.vw_ContractLines
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkContractLine != null)
                    {
                        var rs = new
                        {
                            data = checkContractLine,
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

        #region -- Update contract line --

        [HttpPut]
        [Route("api/contracts/lines")]
        public async Task<object> UpdateContractLine(tbl_ContractLines entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkContractLine = await db.tbl_ContractLines
                        .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkContractLine != null)
                    {
                        var rate = Math.Round((decimal)(entity.TotalPrice / entity.TotalCases));

                        decimal net = 0;
                        decimal discount = 0;

                        if (entity.Discount != null && entity.PercentageDiscount == null)
                        {
                            discount += Math.Round((decimal)entity.Discount);
                        }
                        else if (entity.Discount == null && entity.PercentageDiscount != null)
                        {
                            discount += Math.Round((decimal)((entity.TotalPrice / 100) * entity.PercentageDiscount));
                        }

                        net = Math.Round((decimal)entity.TotalPrice - discount);

                        // Update contract
                        var checkContract = db.tbl_Contracts
                            .FirstOrDefault(x => x.ID == entity.ContractID);

                        if (checkContract != null)
                        {
                            var totalPrice = (checkContract.TotalPrice + entity.TotalPrice) - checkContractLine.TotalPrice;
                            var netPrice = (checkContract.NetPrice + net) - checkContractLine.Net;
                            var totalDiscount = (checkContract.TotalDiscount + discount) - checkContractLine.TotalDiscount;

                            checkContract.TotalPrice = totalPrice;
                            checkContract.TotalDiscount = totalDiscount;
                            checkContract.NetPrice = netPrice;
                            checkContract.ModifiedOn = DateTime.Now;
                            checkContract.ModifiedBy = entity.ModifiedBy;
                        }

                        // Update contract line
                        checkContractLine.ProductID = entity.ProductID;
                        checkContractLine.AccountID = entity.AccountID;
                        checkContractLine.UnitID = entity.UnitID;
                        checkContractLine.SerialNumber = entity.SerialNumber;
                        checkContractLine.Title = entity.Title;
                        checkContractLine.StartDate = entity.StartDate;
                        checkContractLine.EndDate = entity.EndDate;
                        checkContractLine.Quantity = entity.Quantity;
                        checkContractLine.Rate = rate;
                        checkContractLine.TotalPrice = entity.TotalPrice;
                        checkContractLine.Discount = entity.Discount;
                        checkContractLine.PercentageDiscount = entity.PercentageDiscount;
                        checkContractLine.TotalDiscount = discount;
                        checkContractLine.Net = net;
                        checkContractLine.TotalCases = entity.TotalCases;
                        checkContractLine.Used = 0;
                        checkContractLine.Remaining = entity.TotalCases;
                        checkContractLine.ProvinceID = entity.ProvinceID;
                        checkContractLine.DistrictID = entity.DistrictID;
                        checkContractLine.WardID = entity.WardID;
                        checkContractLine.Location = entity.Location;
                        checkContractLine.ModifiedOn = DateTime.Now;
                        checkContractLine.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete contract line --

        [HttpDelete]
        [Route("api/contracts/lines/{contractID}")]

        public async Task<object> DeleteContractLine(DeleteData data, Guid contractID)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    decimal totalPrice = 0;
                    decimal totalDiscount = 0;
                    decimal netPrice = 0;

                    List<string> iDCalls = new List<string>();

                    foreach (var item in data.ID)
                    {
                        var ID = "'" + item + "'";
                        iDCalls.Add(ID);

                        var line = await db.tbl_ContractLines
                            .FirstOrDefaultAsync(x => x.ID == item);

                        if (line != null)
                        {
                            totalPrice += line.TotalPrice.GetValueOrDefault();
                            totalDiscount += line.TotalDiscount.GetValueOrDefault();
                            netPrice += line.Net.GetValueOrDefault();
                        }
                    }

                    var finalListID = string.Join(",", iDCalls);

                    var exDelete = await ExecSQLSync("DELETE dbo.tbl_ContractLines" +
                        " WHERE ID IN (" + finalListID + ")");

                    // Update contract

                    var checkContract = await db.tbl_Contracts
                        .FirstOrDefaultAsync(x => x.ID == contractID);

                    if (checkContract != null)
                    {
                        checkContract.TotalPrice = checkContract.TotalPrice - totalPrice;
                        checkContract.TotalDiscount = checkContract.TotalDiscount - totalDiscount;
                        checkContract.NetPrice = checkContract.NetPrice - netPrice;

                        await db.SaveChangesAsync();
                    }

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
