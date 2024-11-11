namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_ConfigCodes
    {
        public Guid ID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public int CurrentNumber { get; set; }

        public int? SequenceNumberLength { get; set; }

        [StringLength(50)]
        public string Format { get; set; }

        [StringLength(50)]
        public string Prefix { get; set; }

        [StringLength(50)]
        public string Subfix { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
