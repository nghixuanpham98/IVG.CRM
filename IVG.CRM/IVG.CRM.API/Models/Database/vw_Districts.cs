namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Districts
    {
        [Key]
        public Guid DistrictID { get; set; }

        [StringLength(255)]
        public string DistrictCode { get; set; }

        [StringLength(255)]
        public string DistrictName { get; set; }

        public Guid? ProvinceID { get; set; }

        [StringLength(255)]
        public string ProvinceCode { get; set; }

        [StringLength(255)]
        public string ProvinceName { get; set; }
    }
}
