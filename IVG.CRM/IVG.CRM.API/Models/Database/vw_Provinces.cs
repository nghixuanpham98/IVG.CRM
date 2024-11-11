namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Provinces
    {
        [Key]
        public Guid ProvinceID { get; set; }

        [StringLength(255)]
        public string ProvinceCode { get; set; }

        [StringLength(255)]
        public string ProvinceName { get; set; }
    }
}
