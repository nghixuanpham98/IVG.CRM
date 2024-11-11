namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_RolePermissions
    {
        public Guid ID { get; set; }

        public Guid? RoleID { get; set; }

        public int? MenuID { get; set; }

        public bool? Access { get; set; }

        public bool? Create { get; set; }

        public bool? Update { get; set; }

        public bool? Delete { get; set; }

        public bool? Import { get; set; }

        public bool? Export { get; set; }
    }
}
