namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_ZaloWebhooks
    {
        public Guid ID { get; set; }

        [StringLength(250)]
        public string EventName { get; set; }

        [StringLength(50)]
        public string TimeStamp { get; set; }

        public string Content { get; set; }

        public int? Status { get; set; }

        public DateTime? CreatedOn { get; set; }
    }
}
