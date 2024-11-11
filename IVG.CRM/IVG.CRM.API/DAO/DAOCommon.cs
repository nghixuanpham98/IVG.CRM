using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.Data;
using System.Drawing.Printing;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace IVG.CRM.API.DAO
{
    public class DAOCommon
    {

        public static class Database
        {
            public static DataTable Paging(AdvEntity param,ref PagingEntity paging, ref string error)
            {
                try
                {
                    DBContext db = new DBContext();

                    param.WhereClause = !string.IsNullOrEmpty(param.WhereClause) ? $" WHERE {param.WhereClause} " : "";

                    param.OrderByColumn = !string.IsNullOrEmpty(param.OrderByColumn) ? $" ORDER BY {param.OrderByColumn}" : "";

                    param.OrderByDirection = !string.IsNullOrEmpty(param.OrderByColumn) ? param.OrderByDirection : "";

                    int selectPage = (param.PageIndex - 1) * param.PageSize;

                    string Query = $" SELECT {param.Columns} FROM {param.TableViewName} {param.WhereClause} {param.OrderByColumn} {param.OrderByDirection} ";

                    if (param.PageSize > 0)
                    {
                        Query += $" OFFSET {selectPage} ROWS ";

                        Query += $" FETCH NEXT {param.PageSize}  ROWS ONLY ";
                    }

                    string QueryTotalRecords = $" SELECT COUNT(1) FROM {param.TableViewName} {param.WhereClause} ";

                    int TotalRecords = db.Database.SqlQuery<int>(QueryTotalRecords).FirstOrDefault();

                    double TotalPages_ = (double)TotalRecords / (double)param.PageSize;

                    int TotalPages = (TotalPages_ % 1) >= 0.01 ? (int)TotalPages_ + 1 : (int)TotalPages_;

                    TotalPages = TotalPages > 0 ? TotalPages : 1;

                    param.PageIndex = TotalPages > 0 && param.PageIndex > TotalPages ? TotalPages : param.PageIndex;

                    var Data = new DataTable();

                    using (var ctx = new DBContext())
                    {
                        var cmd = ctx.Database.Connection.CreateCommand();
                        cmd.CommandText = Query;

                        cmd.Connection.Open();
                        Data.Load(cmd.ExecuteReader());
                    }

                    paging = new PagingEntity
                    {
                        PageIndex = param.PageIndex,
                        PageSize = param.PageSize,
                        TotalPages = TotalPages,
                        TotalRecords = TotalRecords
                    };

                    return Data;
                }
                catch (Exception ex)
                {
                    error = ex.Message;
                    return null;
                }
            }
        }

        public static void WriteLog(object Message)
        {
            try
            {
                string folder = System.Web.HttpContext.Current.Server.MapPath("~/Logs/");

                if (!System.IO.Directory.Exists(folder)) System.IO.Directory.CreateDirectory(folder);

                string path = System.Web.HttpContext.Current.Server.MapPath("~/Logs/" + DateTime.Now.ToString("yyyyMMdd") + ".txt");

                if (!System.IO.File.Exists(path)) System.IO.File.Create(path).Close();

                TextWriter tw = new StreamWriter(path, true);

                tw.WriteLine($"\n{DateTime.Now.ToString("HH:mm:ss")}\t{Message}");

                tw.Close();
            }
            catch { }
        }


        public class VerifySHA1
        {
            public static string GetSHA1(string text, string userName)
            {
                SHA1 data = SHA1.Create();
                string hash = GetSHA1Hash(data, text + userName);
                return hash;
            }

            public static string GetSHA1Hash(SHA1 _data, string input)
            {
                byte[] data = _data.ComputeHash(Encoding.UTF8.GetBytes(input));

                StringBuilder sBuilder = new StringBuilder();

                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }
                return sBuilder.ToString();
            }
        }


        public static void PagingStore(string SelectColumn, string TableOrView, string WhereClause, string OrderByColumn, string OrderByDirection, int PageIndex, int PageSize,
                 ref int TotalPages, ref int TotalRecords, ref DataTable DT)
        {
            using (SqlConnection _connect = new SqlConnection(ConfigurationManager.AppSettings["ConnectDB"]))
            {
                _connect.Open();
                DbDataReader rdr = null;
                var dt = new DataTable();
                try
                {
                    using (var command = _connect.CreateCommand())
                    {
                        TotalPages = 1;
                        TotalRecords = 0;

                        command.CommandText = "pro_IVG_Paging";
                        command.CommandType = CommandType.StoredProcedure;

                        SqlParameter[] dbParams = new SqlParameter[9]
                        {
                        new SqlParameter("@TableOrView", TableOrView),
                        new SqlParameter("@SelectedPage", PageIndex),
                        new SqlParameter("@PageSize", PageSize),
                        new SqlParameter("@Columns", SelectColumn),
                        new SqlParameter("@OrderByColumn", OrderByColumn),
                        new SqlParameter("@OrderByDirection", OrderByDirection),
                        new SqlParameter("@WhereClause", WhereClause),
                        new SqlParameter("@totalPages", DbType.Int32) { Direction = ParameterDirection.Output },
                        new SqlParameter("@totalRecords", DbType.Int32) { Direction = ParameterDirection.Output }
                        };

                        command.Parameters.AddRange(dbParams);

                        command.ExecuteScalar();

                        TotalPages = GetOutputParameter(command.Parameters["@totalPages"]);
                        TotalRecords = GetOutputParameter(command.Parameters["@totalRecords"]);

                        rdr = command.ExecuteReader(CommandBehavior.CloseConnection);


                        dt.Load(rdr);
                        DT = dt;
                    }
                }
                catch (Exception ex)
                {

                }
                finally
                {
                    dt.Dispose();
                    rdr?.Close();
                    _connect.Close();
                    _connect.Dispose();
                }
            }


            int GetOutputParameter(SqlParameter parameter)
            {
                try
                {
                    return Convert.ToInt32(parameter.Value);
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }

        public class Paggin
        {
            public int PageIndex { get; set; } = 1;

            public int PageSize { get; set; } = 3;

            public int? TotalPages { get; set; }

            public int? TotalRecords { get; set; }

        }

        public static async Task<DataTable> ExecSQLSync(string Query)
        {
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection _connect = new SqlConnection(ConfigurationManager.AppSettings["ConnectDB"]))
                {

                    await _connect.OpenAsync();
                    using (SqlCommand cmd = new SqlCommand(Query, _connect))
                    {
                        cmd.CommandType = CommandType.Text;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt);
                        }
                        int a = await cmd.ExecuteNonQueryAsync();
                    }

                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                dt.Dispose();
            }
            return dt;

        }

        public static bool IsNumeric(string s)
        {
            foreach (char c in s)
            {
                if (!char.IsDigit(c) && c != '.')
                {
                    return false;
                }
            }

            return true;
        }

    }
}