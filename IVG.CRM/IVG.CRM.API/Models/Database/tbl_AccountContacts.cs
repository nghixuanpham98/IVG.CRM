namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_AccountContacts
    {
        public Guid ID { get; set; }

        public Guid? AccountID { get; set; }

        public Guid? ContactID { get; set; }

        public bool? IsPrimary { get; set; }
    }
}
