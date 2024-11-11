using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;

namespace IVG.CRM.API.DAO
{
    public class DAOMasterData
    {
        public static string Vietnamese = " collate Latin1_General_CI_AI ";

        public static void DeleteFolderByEntityID(Guid entityId, ref string error)
        {
            try
            {
                DBContext db = new DBContext();
                var notes = db.tbl_ActivityNotes.Where(x => x.EntityID == entityId).ToList();
                var liNotes = new List<tbl_ActivityNotes>();
                var liFiles = new List<tbl_ActivityNoteFiles>();
                foreach (var note in notes)
                {
                    var files = db.tbl_ActivityNoteFiles.Where(x => x.NoteID == note.ID).ToList();

                    foreach (var file in files)
                    {
                        //tìm file đó có ở folder không
                        if (System.IO.File.Exists(file.FilePath)) System.IO.File.Delete(file.FilePath);
                        liFiles.AddRange(files);
                    }
                    liNotes.Add(note);
                }

                //delete folder đó luôn
                var folderEntity = Path.Combine(HttpContext.Current.Server.MapPath("~/File/NoteAttach"), entityId.ToString());

                if (Directory.Exists(folderEntity)) Directory.Delete(folderEntity);

                if (liNotes.Count > 0) db.tbl_ActivityNotes.RemoveRange(liNotes);
                if (liFiles.Count > 0) db.tbl_ActivityNoteFiles.RemoveRange(liFiles);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                error = ex.Message;
            }
        }

        public static List<vw_Provinces> Provinces()
        {
            try
            {
                DBContext db = new DBContext();

                string query = "SELECT * FROM vw_Provinces @where ORDER BY ProvinceName";
                string whereClause = "";

                //if (!string.IsNullOrEmpty(keyword))
                //{
                //    whereClause = $" WHERE ProvinceName {Vietnamese} LIKE '%{keyword}%' {Vietnamese} OR ProvinceCode like '%{keyword}%' ";
                //}
                query = query.Replace("@where", whereClause);
                return db.Database.SqlQuery<vw_Provinces>(query).ToList();
            }
            catch
            {
                return null;
            }
        }

        public static List<vw_Districts> Districts(Guid? ProvinceID)
        {
            try
            {
                DBContext db = new DBContext();

                string query = "SELECT * FROM vw_Districts @where ORDER BY DistrictName";
                string whereClause = $" WHERE ProvinceID='{ProvinceID}' ";

                //if (!string.IsNullOrEmpty(keyword))
                //{
                //    whereClause += !string.IsNullOrEmpty(whereClause) ? " AND " : " WHERE ";
                //    whereClause += $" DistrictName {Vietnamese} LIKE '%{keyword}%' {Vietnamese} OR DistrictCode like '%{keyword}%' ";
                //}
                query = query.Replace("@where", whereClause);
                return db.Database.SqlQuery<vw_Districts>(query).ToList();
            }
            catch
            {
                return null;
            }
        }

        public static List<vw_Wards> Wards(Guid? ProvinceID, Guid? DistrictID)
        {
            try
            {
                DBContext db = new DBContext();

                string query = "SELECT * FROM vw_Wards @where ORDER BY WardName";
                string whereClause = $" WHERE ProvinceID='{ProvinceID}' AND  DistrictID='{DistrictID}' ";

                //if (!string.IsNullOrEmpty(keyword))
                //{
                //    whereClause += !string.IsNullOrEmpty(whereClause) ? " AND " : " WHERE ";
                //    whereClause += $" WardName {Vietnamese} LIKE '%{keyword}%' {Vietnamese} OR WardCode like '%{keyword}%' ";
                //}
                query = query.Replace("@where", whereClause);
                return db.Database.SqlQuery<vw_Wards>(query).ToList();
            }
            catch
            {
                return null;
            }
        }

        public class OptionSet
        {
            public static List<tbl_OptionSetValue> LeadStatus()
            {
                DBContext db = new DBContext();
                var optionSetId = db.tbl_OptionSet.FirstOrDefault(x => x.Name == "lead-status")?.OptionSetId;
                if (optionSetId.HasValue && optionSetId > 0)
                {
                    return db.tbl_OptionSetValue.Where(x => x.OptionSetId == optionSetId).OrderBy(x => x.Value).ToList();
                }
                return null;
            }
            public static List<tbl_OptionSetValue> LeadSource()
            {
                DBContext db = new DBContext();
                var optionSetId = db.tbl_OptionSet.FirstOrDefault(x => x.Name == "lead-source")?.OptionSetId;
                if (optionSetId.HasValue && optionSetId > 0)
                {
                    return db.tbl_OptionSetValue.Where(x => x.OptionSetId == optionSetId).OrderBy(x => x.Value).ToList();
                }
                return null;
            }
            public static List<tbl_OptionSetValue> Currency()
            {
                DBContext db = new DBContext();
                var optionSetId = db.tbl_OptionSet.FirstOrDefault(x => x.Name == "currency")?.OptionSetId;
                if (optionSetId.HasValue && optionSetId > 0)
                {
                    return db.tbl_OptionSetValue.Where(x => x.OptionSetId == optionSetId).OrderBy(x => x.Value).ToList();
                }
                return null;
            }
            public static List<tbl_OptionSetValue> PurchaseTimeframe()
            {
                DBContext db = new DBContext();
                var optionSetId = db.tbl_OptionSet.FirstOrDefault(x => x.Name == "purchase-timeframe")?.OptionSetId;
                if (optionSetId.HasValue && optionSetId > 0)
                {
                    return db.tbl_OptionSetValue.Where(x => x.OptionSetId == optionSetId).OrderBy(x => x.Value).ToList();
                }
                return null;
            }
            public static List<tbl_OptionSetValue> PurchaseProcess()
            {
                DBContext db = new DBContext();
                var optionSetId = db.tbl_OptionSet.FirstOrDefault(x => x.Name == "purchase-process")?.OptionSetId;
                if (optionSetId.HasValue && optionSetId > 0)
                {
                    return db.tbl_OptionSetValue.Where(x => x.OptionSetId == optionSetId).OrderBy(x => x.Value).ToList();
                }
                return null;
            }
        }

        public class EntityStatus
        {
            public static List<tbl_EntityStatus> LeadStatus()
            {
                DBContext db = new DBContext();

                var entityId = db.tbl_Entities.FirstOrDefault(x => x.Name == "lead")?.ID;

                if (entityId.HasValue)
                {
                    return db.tbl_EntityStatus.Where(x => x.EntityID == entityId.Value).OrderBy(x => x.StatusID).ToList();
                }
                return null;
            }

            public static List<tbl_EntityStatusReason> LeadStatusReason(int statusId)
            {
                DBContext db = new DBContext();

                var entityId = db.tbl_Entities.FirstOrDefault(x => x.Name == "lead")?.ID;

                if (entityId.HasValue)
                {
                    return db.tbl_EntityStatusReason.Where(x => x.EntityID == entityId.Value && x.StatusID == statusId).OrderBy(x => x.StatusReasonID).ToList();
                }
                return null;
            }

            public static async Task<object> GetStatus(DBContext db, string name) {
                try
                {
                    var checkEntity = await db.tbl_Entities
                        .FirstOrDefaultAsync(x => x.Name == name);

                    if (checkEntity != null)
                    {
                        var status = await db.tbl_EntityStatus
                            .Where(x => x.EntityID == checkEntity.ID)
                            .OrderBy(x => x.StatusID)
                            .ToListAsync();

                        var reason = await db.tbl_EntityStatusReason
                            .Where(x => x.EntityID == checkEntity.ID)
                            .OrderBy(x => x.StatusID)
                            .ToListAsync();

                        var rs = new
                        {
                            status = status,
                            reason = reason,
                        };

                        return rs;
                    }

                    return null;
                }
                catch (Exception)
                {

                    throw;
                }
            }

        }
    }
}