using IVG.CRM.API.Areas.HelpPage.ModelDescriptions;
using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.UI.WebControls;
using static IVG.CRM.API.Common.ApiResponse;
using static IVG.CRM.API.DAO.DAOCommon;
using static IVG.CRM.API.DAO.Functions;
using static System.Net.WebRequestMethods;

namespace IVG.CRM.API.Controllers
{
    public class ActivitiesController : ApiController
    {
        #region -- Configuration --

        DBContext db = new DBContext();

        public static DataTable dataResult = new DataTable();

        #endregion

        #region -- Method --

        #region -- Notes --

        #region -- Create note --

        [HttpPost]
        [Route("api/notes")]
        public IHttpActionResult CreateNote()
        {
            try
            {
                var fileAttachment = HttpContext.Current.Request.Files;

                var inputString = HttpContext.Current.Request["Note"];

                var param = new tbl_ActivityNotes();

                try
                {
                    param = Newtonsoft.Json.JsonConvert.DeserializeObject<tbl_ActivityNotes>(inputString);
                }
                catch
                {
                    param = null;
                }

                var noteId = Guid.NewGuid();
                var note = new tbl_ActivityNotes()
                {
                    ID = noteId,
                    EntityID = param.EntityID.Value,
                    Title = param.Title,
                    Content = param.Content,
                    CreatedOn = DateTime.Now,
                    CreatedBy = param.CreatedBy,
                    ModifiedOn = DateTime.Now,
                    ModifiedBy = param.ModifiedBy,
                };

                db.tbl_ActivityNotes.Add(note);

                if (fileAttachment.Count > 0)
                {
                    for (int i = 0; i < fileAttachment.Count; i++)
                    {
                        var fileUpload = fileAttachment[i];

                        if (fileUpload.ContentLength > 0)
                        {
                            var folderFile = HttpContext.Current.Server.MapPath("~/File");
                            if (!Directory.Exists(folderFile)) Directory.CreateDirectory(folderFile);

                            var folderAttach = HttpContext.Current.Server.MapPath("~/File/NoteAttach");
                            if (!Directory.Exists(folderAttach)) Directory.CreateDirectory(folderAttach);

                            var urlFolder = Path.Combine(folderAttach, param.EntityID.Value.ToString());

                            if (!Directory.Exists(urlFolder)) Directory.CreateDirectory(urlFolder);

                            var filePath = Path.Combine(urlFolder, fileUpload.FileName);

                            fileUpload.SaveAs(filePath);

                            var file = new tbl_ActivityNoteFiles
                            {
                                ID = Guid.NewGuid(),
                                NoteID = noteId,
                                FilePath = filePath,
                                FileName = fileUpload.FileName,
                                FileType = fileUpload.ContentType,
                                CreatedOn = DateTime.Now,
                                CreatedBy = param.CreatedBy,
                                ModifiedOn = DateTime.Now,
                                ModifiedBy = param.ModifiedBy,
                            };

                            db.tbl_ActivityNoteFiles.Add(file);

                        }
                    }
                }

                db.SaveChanges();

                var rs = new
                {
                    code = Code.Success,
                    messVN = Language.VN.alertCreateDataSuccess,
                    messEN = Language.EN.alertCreateDataSuccess
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

                return Json(rs);
            }
        }

        #endregion

        #region -- Get note list --

        [HttpPost]
        [Route("api/notes/list")]
        public IHttpActionResult GetNoteList(AdvEntity param)
        {
            try
            {
                var data = db.vw_ActivityNotes
                    .Where(x => x.EntityID == param.ID.Value)
                    .OrderByDescending(x => x.CreatedOn)
                    .ToList();

                if (data != null && data.Count > 0)
                {
                    var listID = data.Select(x => x.ID).ToList();

                    var files = db.vw_ActivityNoteFiles
                        .Where(x => x.NoteID.HasValue && listID.Contains(x.NoteID.Value))
                        .OrderBy(x => x.FileName)
                        .ToList();

                    if (files != null && files.Count > 0)
                    {
                        var attach = new List<AttachFileEntity>();

                        foreach (var item in files)
                        {
                            if (System.IO.File.Exists(item.FilePath))
                            {
                                string base64String = Convert.ToBase64String(System.IO.File.ReadAllBytes(item.FilePath));

                                attach.Add(new AttachFileEntity
                                {
                                    ID = item.ID,
                                    NoteID = item.NoteID,
                                    FileName = item.FileName,
                                    FileBase64 = $"data:{item.FileType};base64,{base64String}"
                                });
                            }
                        }

                        var rs = new
                        {
                            data = data,
                            files = attach,
                            code = Code.Success
                        };

                        return Json(rs);
                    }

                    var rs1 = new
                    {
                        data = data,
                        files = files,
                        code = Code.Success
                    };

                    return Json(rs1);
                }

                var rs2 = new
                {
                    data = data,
                    code = Code.Success
                };

                return Json(rs2);
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

                return Json(rs);
            }
        }

        #endregion

        #region -- Update note --

        [HttpPut]
        [Route("api/notes")]
        public IHttpActionResult UpdateNote()
        {
            try
            {
                var fileAttachment = HttpContext.Current.Request.Files;

                var inputString = HttpContext.Current.Request["Note"];

                var param = new tbl_ActivityNotes();

                try
                {
                    param = Newtonsoft.Json.JsonConvert.DeserializeObject<tbl_ActivityNotes>(inputString);
                }
                catch
                {
                    param = null;
                }

                var checkNote = db.tbl_ActivityNotes
                    .FirstOrDefault(x => x.ID == param.ID);

                if (checkNote != null)
                {
                    checkNote.Title = param.Title;
                    checkNote.Content = param.Content;
                    checkNote.ModifiedOn = DateTime.Now;
                    checkNote.ModifiedBy = param.ModifiedBy;

                    if (fileAttachment.Count > 0)
                    {
                        for (int i = 0; i < fileAttachment.Count; i++)
                        {
                            var fileUpload = fileAttachment[i];

                            if (fileUpload.ContentLength > 0)
                            {
                                var folderFile = HttpContext.Current.Server.MapPath("~/File");
                                if (!Directory.Exists(folderFile)) Directory.CreateDirectory(folderFile);

                                var folderAttach = HttpContext.Current.Server.MapPath("~/File/NoteAttach");
                                if (!Directory.Exists(folderAttach)) Directory.CreateDirectory(folderAttach);

                                var urlFolder = Path.Combine(folderAttach, param.EntityID.Value.ToString());

                                if (!Directory.Exists(urlFolder)) Directory.CreateDirectory(urlFolder);

                                var filePath = Path.Combine(urlFolder, fileUpload.FileName);

                                fileUpload.SaveAs(filePath);

                                var file = new tbl_ActivityNoteFiles
                                {
                                    ID = Guid.NewGuid(),
                                    NoteID = param.ID,
                                    FilePath = filePath,
                                    FileName = fileUpload.FileName,
                                    FileType = fileUpload.ContentType,
                                    CreatedOn = DateTime.Now,
                                    CreatedBy = param.CreatedBy,
                                    ModifiedOn = DateTime.Now,
                                    ModifiedBy = param.ModifiedBy,
                                };

                                db.tbl_ActivityNoteFiles.Add(file);

                            }
                        }
                    }

                    db.SaveChanges();
                }

                var rs = new
                {
                    code = Code.Success,
                    messVN = Language.VN.alertUpdateDataSuccess,
                    messEN = Language.EN.alertUpdateDataSuccess
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

                return Json(rs);
            }
        }

        #endregion

        #region -- Delete note --

        [HttpDelete]
        [Route("api/notes")]
        public IHttpActionResult DeleteNote(AdvEntity param)
        {
            try
            {
                var liFile = new List<tbl_ActivityNoteFiles>();

                var note = db.tbl_ActivityNotes.FirstOrDefault(x => x.ID == param.ID.Value);

                if (note != null)
                {
                    var files = db.tbl_ActivityNoteFiles.Where(x => x.NoteID == param.ID).ToList();

                    if (files != null && files.Count > 0)
                    {
                        foreach (var file in files)
                        {
                            if (System.IO.File.Exists(file.FilePath)) System.IO.File.Delete(file.FilePath);
                            liFile.Add(file);
                        }
                    }

                    if (liFile.Count() > 0) db.tbl_ActivityNoteFiles.RemoveRange(liFile);

                    db.tbl_ActivityNotes.Remove(note);

                    db.SaveChanges();
                }

                var rs = new
                {
                    code = Code.Success,
                    messVN = Language.VN.alertDeleteDataSuccess,
                    messEN = Language.EN.alertDeleteDataSuccess
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

                return Json(rs);
            }
        }

        #endregion

        #region -- Delete file of note --

        [HttpDelete]
        [Route("api/notes/files")]
        public IHttpActionResult DeleteNoteFile(AdvEntity param)
        {
            try
            {
                var file = db.tbl_ActivityNoteFiles.FirstOrDefault(x => x.ID == param.ID);

                if (file != null)
                {
                    if (System.IO.File.Exists(file.FilePath)) System.IO.File.Delete(file.FilePath);
                    db.tbl_ActivityNoteFiles.Remove(file);
                    db.SaveChanges();
                }

                var rs = new
                {
                    code = Code.Success,
                    messVN = Language.VN.alertDeleteDataSuccess,
                    messEN = Language.EN.alertDeleteDataSuccess
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

                return Json(rs);
            }
        }

        #endregion

        #endregion

        #region -- Tasks --

        #region -- Create task --

        [HttpPost]
        [Route("api/tasks")]
        public async Task<object> CreateTask(tbl_ActivityTasks entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var id = Guid.NewGuid();
                    var item = new tbl_ActivityTasks();

                    item.ID = id;
                    item.EntityID = entity.EntityID;
                    item.OwnerID = entity.OwnerID;
                    item.Subject = entity.Subject;
                    item.Description = entity.Description;
                    item.Due = entity.Due;
                    item.Priority = entity.Priority;
                    item.Status = 0;
                    item.CreatedOn = DateTime.Now;
                    item.CreatedBy = entity.CreatedBy;
                    item.ModifiedOn = DateTime.Now;
                    item.ModifiedBy = entity.ModifiedBy;

                    db.tbl_ActivityTasks.Add(item);

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

        #region -- Get task list --

        [HttpPost]
        [Route("api/tasks/list")]

        public async Task<object> GetTaskList(Pagination parameters)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    if (parameters.isAll != null)
                    {
                        var taskList = await db.vw_ActivityTasks
                            .Where(x => x.EntityID == parameters.id)
                            .OrderBy(x => x.Subject)
                            .ToListAsync();

                        var rs = new
                        {
                            data = taskList,
                            code = Code.Success
                        };

                        return rs;
                    }
                    else
                    {
                        string Columns = " * ";
                        string TableOrView = " dbo.vw_ActivityTasks ";
                        string whereClause = " ID is not null ";

                        if (!string.IsNullOrEmpty(parameters.keySearch))
                        {
                            whereClause += " AND ( Subject " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
                                + "%' OR Description " + DAOMasterData.Vietnamese + " LIKE N'%" + parameters.keySearch
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
                            status = await DAOMasterData.EntityStatus.GetStatus(db, "tasks"),
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

        #region -- Get task details --

        [HttpGet]
        [Route("api/tasks/{id}")]

        public async Task<object> GetTaskDetails(Guid id)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkTask = await db.vw_ActivityTasks
                        .FirstOrDefaultAsync(x => x.ID == id);

                    if (checkTask != null)
                    {
                        var rs = new
                        {
                            data = checkTask,
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

        #region -- Update task --

        [HttpPut]
        [Route("api/tasks")]
        public async Task<object> UpdateTask(tbl_ActivityTasks entity)
        {
            try
            {
                var authHeader = HttpContext.Current.Request.Headers["Authorization"];

                if (!await Authentication.CheckTokenInvalid(authHeader))
                {
                    var checkTask = await db.tbl_ActivityTasks
                            .FirstOrDefaultAsync(x => x.ID == entity.ID);

                    if (checkTask != null)
                    {
                        checkTask.Status = entity.Status;

                        if (entity.Status == 1)
                        {
                            checkTask.CompletedOn = DateTime.Now;
                            checkTask.CompletedBy = entity.CompletedBy;
                        }
                        else
                        {
                            checkTask.OwnerID = entity.OwnerID;
                            checkTask.Subject = entity.Subject;
                            checkTask.Description = entity.Description;
                            checkTask.Due = entity.Due;
                            checkTask.Priority = entity.Priority;
                        }
                       
                        checkTask.ModifiedOn = DateTime.Now;
                        checkTask.ModifiedBy = entity.ModifiedBy;

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

        #region -- Delete task --

        [HttpDelete]
        [Route("api/tasks")]

        public async Task<object> DeleteTask(DeleteData data)
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

                    await ExecSQLSync("DELETE dbo.tbl_ActivityTasks WHERE ID IN (" + finalListID + ")");

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
