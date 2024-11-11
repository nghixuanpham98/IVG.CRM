namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_ZaloCheckUnReadMessages
    {
        [Key]
        [StringLength(50)]
        public string UserID { get; set; }

        [StringLength(50)]
        public string Time { get; set; }
    }
}
