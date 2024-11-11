using System;
using System.IO;
using System.Web;
using System.Linq;
using System.Text;
using System.Security.Claims;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using IVG.CRM.API.Models.Customize;
using System.Threading.Tasks;
using IVG.CRM.API.Models.Database;
using static IVG.CRM.API.DAO.DAOCommon;
using System.Data.Entity;

namespace IVG.CRM.API.DAO
{
    public class Functions
    {
        #region -- Authentication --

        public class Authentication 
        {
            public static string CreateTokenWithUser(UserLogin entity)
            {
                try
                {
                    DateTime issuedAt = DateTime.UtcNow;
                    DateTime expires = DateTime.UtcNow.AddYears(1);
                    const string sec = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";

                    var tokenHandler = new JwtSecurityTokenHandler();
                    ClaimsIdentity claimsIdentity = new ClaimsIdentity(new[]
                    {
                        new Claim("Username", entity.Username),
                        new Claim("BrowserName", entity.BrowserName),
                        new Claim("BrowserVersion", entity.BrowserVersion),
                        new Claim("Device", entity.Device)
                    });

                    var now = DateTime.UtcNow;
                    var securityKey = new SymmetricSecurityKey(Encoding.Default.GetBytes(sec + entity.Username));
                    var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

                    //create the jwt
                    var token = (JwtSecurityToken)tokenHandler.CreateJwtSecurityToken(subject: claimsIdentity, expires: expires, signingCredentials: signingCredentials);

                    var tokenString = tokenHandler.WriteToken(token);

                    return tokenString;
                }
                catch (Exception ex)
                {
                    WriteLog.LogError("Function CreateTokenWithUser Error: " + ex.Message);
                    return null;
                }
            }

            public static async Task<UserResult> SetToken(UserLogin entity)
            {
                try
                {
                    DBContext db = new DBContext();

                    string pwSHA1 = VerifySHA1.GetSHA1(entity.Password, entity.Username);

                    var checkUser = await db.tbl_Users
                        .FirstOrDefaultAsync(x => x.Username == entity.Username
                        && x.Password == pwSHA1
                        && x.IsActive == true);

                    if (checkUser != null)
                    {
                        var token = CreateTokenWithUser(entity);
                        var expires_in = DateTime.UtcNow.AddYears(1);

                        // Update token
                        checkUser.Token = token;

                        // User log
                        var id = Guid.NewGuid();
                        var item = new tbl_UserLogs();

                        item.ID = id;
                        item.UserID = checkUser.ID;
                        item.Type = 1; // type = 1: login, type = 2: Logout
                        item.BrowserName = entity.BrowserName;
                        item.BrowserVersion = entity.BrowserVersion;
                        item.Device = entity.Device;
                        item.CreatedOn = DateTime.Now;
                        item.CreatedBy = checkUser.ID;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = checkUser.ID;

                        db.tbl_UserLogs.Add(item);

                        await db.SaveChangesAsync();

                        var user = new UserResult();
                        user.ID = checkUser.ID;
                        user.DepartmentID = checkUser.DepartmentID;
                        user.ManagerID = checkUser.ManagerID;
                        user.Username = checkUser.Username;
                        user.Code = checkUser.Code;
                        user.FirstName = checkUser.FirstName;
                        user.LastName = checkUser.LastName;
                        user.FullName = checkUser.FullName;
                        user.Email = checkUser.Email;
                        user.MobilePhone = checkUser.MobilePhone;
                        user.MainPhone = checkUser.MainPhone;
                        user.Gender = checkUser.Gender;
                        user.Birthday = checkUser.Birthday;
                        user.WardID = checkUser.WardID;
                        user.DistrictID = checkUser.DistrictID;
                        user.ProvinceID = checkUser.ProvinceID;
                        user.Address = checkUser.Address;
                        user.AvatarName = checkUser.AvatarName;
                        user.AvatarType = checkUser.AvatarType;
                        user.AvatarBody = checkUser.AvatarBody;
                        user.Token = checkUser.Token;
                        user.ExpiredIn = expires_in;

                        var checkUserRole = await db.vw_UserRoles
                            .FirstOrDefaultAsync(x => x.UserID == checkUser.ID);

                        if (checkUserRole != null)
                        {
                            user.RoleName = checkUserRole.Name;
                            user.RoleLevel = checkUserRole.Level;
                        }
                        else
                        {
                            user.RoleName = "";
                            user.RoleLevel = 1;
                        }

                        return user;
                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception ex)
                {
                    WriteLog.LogError("Function SetToken Error: " + ex.Message);
                    return null;
                }
            }

            public static async Task<bool> CheckTokenInvalid(object Token)
            {
                try
                {
                    var token = Token.ToString();

                    DBContext db = new DBContext();

                    var Users = await db.tbl_Users
                        .FirstOrDefaultAsync(x => x.Token == token);

                    if (Users == null)
                    {
                        return true;
                    }

                    if (Token == null || string.IsNullOrEmpty(Token.ToString()))
                    {
                        return true;
                    }

                    return false;
                }

                catch (Exception ex)
                {
                    return true;
                }
            }
        }

        #endregion

        #region -- Auto genarate code --

        public static async Task<string> AutoGenerateCode(Guid? id, string name)
        {
            try
            {
                DBContext db = new DBContext();

                var check = await db.tbl_ConfigCodes
                   .FirstOrDefaultAsync(x => x.Name == name);

                if (check != null)
                {
                    var code = check.Prefix
                        + check.CurrentNumber.ToString("D" + check.SequenceNumberLength)
                        + check.Subfix;

                    // Update current number
                    check.CurrentNumber = check.CurrentNumber + 1;
                    check.ModifiedOn = DateTime.Now;
                    check.ModifiedBy = id;

                    await db.SaveChangesAsync();

                    return code;
                }
                else
                {
                    return string.Empty;
                }
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }

        #endregion

        #region -- Write Log --

        public class WriteLog
        {
            public static void LogError(string msg)
            {
                string path = AppDomain.CurrentDomain.BaseDirectory + "\\Logs";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                string filepath = AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\Errors" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
                if (!File.Exists(filepath))
                {
                    // Create a file to write to.   
                    using (StreamWriter sw = File.CreateText(filepath))
                    {
                        sw.WriteLine(DateTime.Now + " - " + msg);
                    }
                }
                else
                {
                    using (StreamWriter sw = File.AppendText(filepath))
                    {
                        sw.WriteLine(DateTime.Now + " - " + msg);
                    }
                }
            }
        }

        #endregion
    }
}