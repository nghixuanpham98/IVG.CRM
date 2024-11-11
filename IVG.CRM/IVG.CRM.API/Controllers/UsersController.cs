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
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static IVG.CRM.API.Common.ApiResponse;
using static IVG.CRM.API.DAO.DAOCommon;
using static IVG.CRM.API.DAO.Functions;

namespace IVG.CRM.API.Controllers
{
    public class UsersController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        public class UserChangePasswordEntity
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string PasswordNew { get; set; }
        }

        #endregion

        #region -- Method --

        #region -- Create user --

        [HttpPost]
        [Route("api/users")]
        public async Task<object> CreateUser(tbl_Users entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {

                    var checkUser = await db.tbl_Users
                        .FirstOrDefaultAsync(x => x.Username == entity.Username.Trim());

                    if (checkUser != null)
                    {
                        var rsa = new
                        {
                            code = Code.Invalid_ID,
                            messVN = Language.VN.alertUsAlreadyExisted,
                            messEN = Language.EN.alertUsAlreadyExisted
                        };

                        return rsa;
                    }

                    // User
                    var idUser = Guid.NewGuid();
                    var itemUser = new tbl_Users();
                    var code = await AutoGenerateCode(entity.ModifiedBy, "Users");

                    if (!string.IsNullOrEmpty(code))
                    {
                        string pwSHA1 = VerifySHA1.GetSHA1("ivgvn123$", entity.Username);

                        itemUser.ID = idUser;
                        itemUser.DepartmentID = entity.DepartmentID;
                        itemUser.ManagerID = entity.ManagerID;
                        itemUser.Username = entity.Username.Trim();
                        itemUser.Password = pwSHA1;
                        itemUser.Code = code;
                        itemUser.FirstName = entity.FirstName.Trim();
                        itemUser.LastName = entity.LastName.Trim();
                        itemUser.FullName = entity.FirstName.Trim() + " " + entity.LastName.Trim();
                        itemUser.Email = entity.Email;
                        itemUser.MobilePhone = entity.MobilePhone;
                        itemUser.MainPhone = entity.MainPhone;
                        itemUser.Gender = entity.Gender;
                        itemUser.Birthday = entity.Birthday;
                        itemUser.IsActive = true;
                        itemUser.AvatarName = entity.AvatarName;
                        itemUser.AvatarType = entity.AvatarType;
                        itemUser.AvatarBody = entity.AvatarBody;
                        itemUser.Token = entity.Token;
                        itemUser.WardID = entity.WardID;
                        itemUser.DistrictID = entity.DistrictID;
                        itemUser.ProvinceID = entity.ProvinceID;
                        itemUser.Address = entity.Address;
                        itemUser.Description = entity.Description;
                        itemUser.CreatedOn = DateTime.Now;
                        itemUser.CreatedBy = entity.CreatedBy;
                        itemUser.ModifiedOn = DateTime.Now;
                        itemUser.ModifiedBy = entity.ModifiedBy;

                        db.tbl_Users.Add(itemUser);

                        // User role
                        var idUserRole = Guid.NewGuid();
                        var itemUserRole = new tbl_UserRoles();

                        var dataRole = await db.tbl_Roles
                            .FirstOrDefaultAsync(x => x.Level == 1);

                        itemUserRole.ID = idUserRole;
                        itemUserRole.RoleID = dataRole.ID;
                        itemUserRole.UserID = idUser;
                        itemUserRole.CreatedOn = DateTime.Now;
                        itemUserRole.CreatedBy = entity.CreatedBy;
                        itemUserRole.ModifiedOn = DateTime.Now;
                        itemUserRole.ModifiedBy = entity.ModifiedBy;

                        db.tbl_UserRoles.Add(itemUserRole);

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

        #region -- Get user list --

        [HttpPost]
        [Route("api/users/list")]

        public async Task<object> GetUserList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string Columns = " * ";
                    string TableOrView = " dbo.vw_Users ";
                    string whereClause = " ID is not null ";

                    if (!string.IsNullOrEmpty(parameters.keySearch))
                    {
                        whereClause += " AND ( FullName " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
                            + "%' OR Code LIKE N'%" + parameters.keySearch
                            + "%' OR Email LIKE N'%" + parameters.keySearch
                            + "%' OR MobilePhone LIKE N'%" + parameters.keySearch
                            + "%' OR MainPhone LIKE N'%" + parameters.keySearch
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

        #region -- Login --

        [HttpPost]
        [Route("api/users/login")]

        public async Task<object> Login(UserLogin entity)
        {
            try
            {
                if (entity != null && !string.IsNullOrEmpty(entity.Username) && !string.IsNullOrEmpty(entity.Password))
                {
                    var obj = await Authentication.SetToken(entity);

                    if (obj != null)
                    {
                        var rs = new
                        {
                            data = new
                            {
                                user = new
                                {
                                    ID = obj.ID,
                                    DepartmentID = obj.DepartmentID,
                                    ManagerID = obj.ManagerID,
                                    Username = obj.Username,
                                    Code = obj.Code,
                                    FirstName = obj.FirstName,
                                    LastName = obj.LastName,
                                    FullName = obj.FullName,
                                    Email = obj.Email,
                                    MobilePhone = obj.MobilePhone,
                                    MainPhone = obj.MainPhone,
                                    Gender = obj.Gender,
                                    Birthday = obj.Birthday,
                                    WardID = obj.WardID,
                                    DistrictID = obj.DistrictID,
                                    ProvinceID = obj.ProvinceID,
                                    Address = obj.Address,
                                    RoleName = obj.RoleName,
                                    RoleLevel = obj.RoleLevel
                                },
                                avatar = new
                                {
                                    AvatarName = obj.AvatarName,
                                    AvatarType = obj.AvatarType,
                                    AvatarBody = obj.AvatarBody
                                },
                                token = new
                                {
                                    Key = obj.Token,
                                    ExpiredIn = obj.ExpiredIn
                                },
                            },
                            code = Code.Success
                        };

                        return rs;
                    }
                    else
                    {
                        var rs = new
                        {
                            code = Code.Invalid_User,
                            messVN = Language.VN.alertInvalidUsPw,
                            messEN = Language.EN.alertInvalidUsPw
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

        #region -- Change password --

        [HttpPost]
        [Route("api/users/change-password")]

        public async Task<object> ChangePassword(UserChangePasswordEntity entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    string pwSHA1 = VerifySHA1.GetSHA1(entity.Password, entity.Username);

                    var checkUser = await db.tbl_Users
                        .FirstOrDefaultAsync(x => x.Username == entity.Username
                        && x.Password == pwSHA1
                        && x.IsActive == true);

                    if (checkUser != null)
                    {
                        var passNew = VerifySHA1.GetSHA1(entity.PasswordNew, entity.Username);

                        checkUser.Password = passNew;
                        checkUser.ModifiedOn = DateTime.Now;
                        checkUser.ModifiedBy = checkUser.ID;

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
                            code = Code.Invalid_User,
                            messVN = Language.VN.alertInvalidUsPw,
                            messEN = Language.EN.alertInvalidUsPw
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

        #region -- Remove token and create log after user logout --

        [HttpPost]
        [Route("api/users/logout")]

        public async Task<object> UserLogout(UserLogout entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkUser = await db.tbl_Users
                        .FirstOrDefaultAsync(x => x.ID == entity.UserID);

                    if (checkUser != null)
                    {
                        checkUser.Token = null;

                        // User log
                        var id = Guid.NewGuid();
                        var item = new tbl_UserLogs();

                        item.ID = id;
                        item.UserID = entity.UserID;
                        item.Type = 2; // type = 1: login, type = 2: Logout
                        item.BrowserName = entity.BrowserName;
                        item.BrowserVersion = entity.BrowserVersion;
                        item.Device = entity.Device;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = checkUser.ID;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = checkUser.ID;

                        db.tbl_UserLogs.Add(item);

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
                            code = Code.Invalid_User,
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

        #region -- Get user list by key --

        [HttpGet]
        [Route("api/users/auto-complete")]

        public async Task<object> GetUserListByKey(string key)

        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var query = await ExecSQLSync(" SELECT TOP 10 ID,Code,FullName AS Name " +
                        "FROM dbo.vw_Users WHERE FullName " + DAOMasterData.Vietnamese + " LIKE N'%" + key + "%'");

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

        #region -- Create role --

        [HttpPost]
        [Route("api/roles")]
        public async Task<object> CreateRole(tbl_Roles entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_Roles();

                    item.ID = id;
                    item.Name = entity.Name;
                    item.Level = entity.Level;
                    item.Status = entity.Status;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_Roles.Add(item);

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
    }
}
