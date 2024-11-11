using IVG.CRM.API.Areas.HelpPage.ModelDescriptions;
using IVG.CRM.API.DAO;
using IVG.CRM.API.Models.Customize;
using IVG.CRM.API.Models.Database;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.UI.WebControls;
using static System.Net.WebRequestMethods;


namespace IVG.CRM.API.Controllers
{
    public class OptionSetController : ApiController
    {

        DBContext db = new DBContext();

        [HttpPost]
        [Route("api/OptionSet/List")]
        public IHttpActionResult OptionSetList()
        {
            try
            {
                var Data = db.tbl_OptionSet.OrderBy(x => x.OptionSetId).ToList();

                return Json(new { Data });
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }


        [HttpPost]
        [Route("api/OptionSet/Detail")]
        public IHttpActionResult OptionSetDetail(AdvEntity ent)
        {
            try
            {

                if (ent != null && ent.IntID.HasValue)
                {

                    var Data = db.tbl_OptionSet.FirstOrDefault(x => x.OptionSetId == ent.IntID.Value);

                    var OptionSetValues = db.tbl_OptionSetValue.Where(x => x.OptionSetId == ent.IntID.Value).OrderBy(x => x.Value).ToList();


                return Json(new { Data , OptionSetValues });


                }


                return Json(new { Error=DAOLanguage.EN.alert_try_again });
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }



    }
}
