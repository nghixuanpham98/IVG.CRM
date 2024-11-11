using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
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
    public class ZaloController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Intermediary --

        #endregion

        #region -- Token --

        #endregion

        #region -- OA --

        #endregion

        #region -- Follower --

        #endregion

        #region -- Webhooks --

        [HttpPost]
        [Route("api/zalo/webhooks")]

        public async Task<object> GetZaloWebhooks()
        {
            try
            {
                var bodyStream = new StreamReader(HttpContext.Current.Request.InputStream);
                bodyStream.BaseStream.Seek(0, SeekOrigin.Begin);

                var bodyText = await bodyStream.ReadToEndAsync();

                var jsonConvert = (JObject)JsonConvert.DeserializeObject(bodyText);
                var eventName = jsonConvert["event_name"].Value<string>();
                var timeStamp = jsonConvert["timestamp"].Value<string>();

                var connectionString = ConfigurationManager.ConnectionStrings["DBContext"].ConnectionString;

                SqlConnection connection = new SqlConnection(@connectionString);

                var query = "INSERT INTO dbo.tbl_ZaloWebhooks" +
                    " (ID,EventName,TimeStamp,Content)" +
                    " VALUES (@ID,@EventName,@TimeStamp,@Content)";

                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@ID", Guid.NewGuid());
                command.Parameters.AddWithValue("@EventName", eventName);
                command.Parameters.AddWithValue("@TimeStamp", timeStamp);
                command.Parameters.AddWithValue("@Content", bodyText);

                try
                {
                    await connection.OpenAsync();
                    await command.ExecuteNonQueryAsync();

                    WriteLog(DateTime.Now + " - Received Webhook: " + JsonConvert.SerializeObject(jsonConvert));
                }
                catch (SqlException e)
                {
                    WriteLog(DateTime.Now + " - Error Generated. Details: " + e.ToString());
                }
                finally
                {
                    connection.Close();
                }

                var rs = new
                {
                    code = Code.Success
                };

                return Json(rs);
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
