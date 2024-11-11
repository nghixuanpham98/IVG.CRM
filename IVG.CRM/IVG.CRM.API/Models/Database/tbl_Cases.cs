namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_Cases
    {
        public Guid ID { get; set; }

        public Guid? ParentID { get; set; }

        public Guid? OwnerID { get; set; }

        public Guid? AccountID { get; set; }

        public Guid? ContactID { get; set; }

        public Guid? ContractID { get; set; }

        public Guid? ContractLineID { get; set; }

        public Guid? ProductID { get; set; }

        public Guid? SubjectID { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(50)]
        public string SerialNumber { get; set; }

        [StringLength(250)]
        public string Title { get; set; }

        public int? Origin { get; set; }

        public int? ServiceType { get; set; }

        public int? ServiceLevel { get; set; }

        public int? Priority { get; set; }

        public int? Status { get; set; }

        public int? StatusReason { get; set; }

        public bool? Escalated { get; set; }

        public DateTime? EscalatedOn { get; set; }

        public DateTime? FollowUpBy { get; set; }

        public bool? FirstResponseSent { get; set; }

        public int? ResolutionType { get; set; }

        public string Resolution { get; set; }

        public DateTime? ResolvedOn { get; set; }

        public Guid? ResolvedBy { get; set; }

        public Guid? BillableTimeID { get; set; }

        public string Remarks { get; set; }

        public DateTime? CanceledOn { get; set; }

        public Guid? CanceledBy { get; set; }

        public string Description { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
