using IVG.CRM.API.Models.Database;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
﻿using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static IVG.CRM.API.Common.ApiResponse;
using static IVG.CRM.API.DAO.Functions;
using static IVG.CRM.API.DAO.DAOCommon;
using System.Data;
using System.Data.Entity;

namespace IVG.CRM.API.Controllers
{
    public class MasterDataController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Config codes --

        #region -- Create config codes --

        [HttpPost]
        [Route("api/configs/codes")]
        public async Task<object> CreateConfigCodes(tbl_ConfigCodes entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_ConfigCodes();

                    item.ID = id;
                    item.Name = entity.Name;
                    item.CurrentNumber = 1;
                    item.SequenceNumberLength = entity.SequenceNumberLength;
                    item.Format = entity.Format;
                    item.Prefix = entity.Prefix;
                    item.Subfix = entity.Subfix;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_ConfigCodes.Add(item);

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

        #endregion

        #region -- Config time minutes --

        #region -- Create config time minutes --

        [HttpPost]
        [Route("api/configs/time-minutes")]
        public async Task<object> CreateConfigTimeMinutes(tbl_ConfigTimeMinutes entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_ConfigTimeMinutes();

                    item.ID = id;
                    item.Title = entity.Title;
                    item.TitleVN = entity.TitleVN;
                    item.Minutes = entity.Minutes;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_ConfigTimeMinutes.Add(item);

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

        #region -- Get config time minutes list --

        [HttpPost]
        [Route("api/configs/time-minutes/list")]

        public async Task<object> GetConfigTimeMinutes(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (parameters.isAll != null)
                    {
                        var list = await db.tbl_ConfigTimeMinutes
                            .OrderBy(x => x.Minutes)
                            .ToListAsync();

                        var rs = new
                        {
                            data = list,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else
                    {
                        string Columns = " * ";
                        string TableOrView = " dbo.vw_ConfigTimeMinutes ";
                        string whereClause = " ID is not null ";

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

        #region -- Languages --

        #region -- Create language label --

        [HttpPost]
        [Route("api/languages")]
        public async Task<object> CreateLanguageLabel(tbl_Languages entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_Languages();

                    item.ID = id;
                    item.Label = entity.Label;
                    item.EN = entity.EN;
                    item.VI = entity.VI;
                    item.Description = entity.Description;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_Languages.Add(item);

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

        #region -- Get language label list --

        [HttpPost]
        [Route("api/languages/list")]

        public async Task<object> GetLanguageLabelList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_Languages ";
                    string whereClause = " ID is not null ";

                    if (!string.IsNullOrEmpty(parameters.keySearch))
                    {
                        whereClause += " AND ( Lable " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
                            + "%' OR EN LIKE N'%" + parameters.keySearch
                            + "%' OR VI " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
                            + "%' ) ";
                    }

                    var TotalPages = 1;
                    var TotalRecords = 0;

                    PagingStore(Columns, TableOrView, whereClause, "ModifiedOn", "DESC", parameters.pageNumber, parameters.pageSize,
                        ref TotalPages, ref TotalRecords, ref dataResult);

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

        #region -- Update language label --
        #endregion

        #region -- Delete language label --
        #endregion

        #endregion

        #region -- Administrative units --

        #region -- Get list Ward --

        [HttpGet]
        [Route("api/wards")]

        public async Task<object> GetListWard(Guid districtID)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (districtID != null)
                    {
                        var wards = await db.tbl_Wards
                            .Where(x => x.DistrictID == districtID)
                            .OrderBy(x => x.Name)
                            .ToListAsync();

                        if (wards.Count > 0 && wards != null)
                        {
                            var rs = new
                            {
                                data = wards,
                                code = Code.Success
                            };

                            return rs;
                        }
                        else
                        {
                            var rs = new
                            {
                                code = Code.Success,
                                messVN = Language.VN.alertNotFoundData,
                                messEN = Language.EN.alertNotFoundData
                            };

                            return rs;
                        }
                    }
                    else
                    {
                        var wards = await db.tbl_Wards
                            .OrderBy(x => x.Name)
                            .ToListAsync();

                        if (wards.Count > 0 && wards != null)
                        {
                            var rs = new
                            {
                                data = wards,
                                code = Code.Success
                            };

                            return rs;
                        }
                        else
                        {
                            var rs = new
                            {
                                code = Code.Success,
                                messVN = Language.VN.alertNotFoundData,
                                messEN = Language.EN.alertNotFoundData
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

        #region -- Get list District --

        [HttpGet]
        [Route("api/districts")]

        public async Task<object> GetListDistrict(Guid provinceID)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (provinceID != null)
                    {
                        var districts = await db.tbl_Districts
                            .Where(x => x.ProvinceID == provinceID)
                            .OrderBy(x => x.Name)
                            .ToListAsync();

                        if (districts.Count > 0 && districts != null)
                        {
                            var rs = new
                            {
                                data = districts,
                                code = Code.Success
                            };

                            return rs;
                        }
                        else
                        {
                            var rs = new
                            {
                                code = Code.Success,
                                messVN = Language.VN.alertNotFoundData,
                                messEN = Language.EN.alertNotFoundData
                            };

                            return rs;
                        }
                    }
                    else
                    {
                        var districts = await db.tbl_Districts
                            .OrderBy(x => x.Name)
                            .ToListAsync();

                        if (districts.Count > 0 && districts != null)
                        {
                            var rs = new
                            {
                                data = districts,
                                code = Code.Success
                            };

                            return rs;
                        }
                        else
                        {
                            var rs = new
                            {
                                code = Code.Success,
                                messVN = Language.VN.alertNotFoundData,
                                messEN = Language.EN.alertNotFoundData
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

        #region -- Get list Province --

        [HttpGet]
        [Route("api/provinces")]

        public async Task<object> GetListProvince()
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var provinces = await db.tbl_Provinces
                        .OrderBy(x => x.Name)
                        .ToListAsync();

                    if (provinces.Count > 0 && provinces != null)
                    {
                        var rs = new
                        {
                            data = provinces,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else
                    {
                        var rs = new
                        {
                            code = Code.Success,
                            messVN = Language.VN.alertNotFoundData,
                            messEN = Language.EN.alertNotFoundData
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

        #endregion

        #endregion


        [HttpPost]
        [Route("api/MasterData/DistByProv")]
        public IHttpActionResult DistByProv(AdvEntity param)
        {
            try
            {
                if (param != null && param.ProvinceID.HasValue)
                {
                    return Json(new { Data = DAOMasterData.Districts(param.ProvinceID.Value) });
                }
                else
                {
                    return Json(new { });
                } 
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }

        [HttpPost]
        [Route("api/MasterData/WardByDistProv")]
        public IHttpActionResult WardByDistPro(AdvEntity param)
        {
            try
            {
                if (param != null && param.ProvinceID.HasValue && param.DistrictID.HasValue)
                { 
                    return Json(new { Data = DAOMasterData.Wards(param.ProvinceID.Value, param.DistrictID.Value) });
                }
                else
                {
                    return Json(new { });
                } 
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }

         
    }
}
