namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_ZaloTagsAndNotes
    {
        public Guid ID { get; set; }

        [StringLength(50)]
        public string UserID { get; set; }

        public string TagsName { get; set; }

        public string Notes { get; set; }
    }
}
