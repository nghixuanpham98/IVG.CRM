namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Cases
    {
        [Key]
        [Column(Order = 0)]
        public Guid ID { get; set; }

        public Guid? ParentID { get; set; }

        [StringLength(250)]
        public string ParentTitle { get; set; }

        public Guid? OwnerID { get; set; }

        [StringLength(50)]
        public string OwnerCode { get; set; }

        [StringLength(250)]
        public string OwnerName { get; set; }

        public Guid? AccountID { get; set; }

        [StringLength(500)]
        public string AccountName { get; set; }

        [StringLength(500)]
        public string Email { get; set; }

        [StringLength(100)]
        public string MainPhone { get; set; }

        public Guid? ContactID { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(1001)]
        public string ContactName { get; set; }

        public Guid? ContractID { get; set; }

        public Guid? ContractLineID { get; set; }

        public Guid? ProductID { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [StringLength(250)]
        public string ProductName { get; set; }

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

        [StringLength(250)]
        public string StatusName { get; set; }

        public int? StatusReason { get; set; }

        [StringLength(250)]
        public string StatusReasonName { get; set; }

        public bool? Escalated { get; set; }

        public DateTime? EscalatedOn { get; set; }

        public DateTime? FollowUpBy { get; set; }

        public bool? FirstResponseSent { get; set; }

        public int? ResolutionType { get; set; }

        public string Resolution { get; set; }

        public DateTime? ResolvedOn { get; set; }

        public Guid? ResolvedBy { get; set; }

        public Guid? BillableTimeID { get; set; }

        [StringLength(50)]
        public string BillableTimeName { get; set; }

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
