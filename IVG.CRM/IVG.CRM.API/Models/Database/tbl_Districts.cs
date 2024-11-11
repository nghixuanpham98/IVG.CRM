namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_Districts
    {
        public Guid ID { get; set; }

        [StringLength(255)]
        public string Code { get; set; }

        [StringLength(255)]
        public string Name { get; set; }

        public Guid? ProvinceID { get; set; }
    }
}
