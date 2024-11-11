namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_UserLogs
    {
        public Guid ID { get; set; }

        public Guid? UserID { get; set; }

        public int? Type { get; set; }

        [StringLength(250)]
        public string BrowserName { get; set; }

        [StringLength(50)]
        public string BrowserVersion { get; set; }

        [StringLength(250)]
        public string Device { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
