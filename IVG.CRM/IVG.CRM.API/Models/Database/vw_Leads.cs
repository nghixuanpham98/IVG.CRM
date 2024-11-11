namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Leads
    {
        [Key]
        public Guid LeadID { get; set; }

        [StringLength(500)]
        public string Topic { get; set; }

        [StringLength(500)]
        public string FirstName { get; set; }

        [StringLength(500)]
        public string LastName { get; set; }

        [StringLength(500)]
        public string JobTitle { get; set; }

        [StringLength(100)]
        public string MainPhone { get; set; }

        [StringLength(100)]
        public string OtherPhone { get; set; }

        [StringLength(500)]
        public string Email { get; set; }

        [StringLength(500)]
        public string Company { get; set; }

        [StringLength(500)]
        public string Website { get; set; }

        public string Address { get; set; }

        public Guid? ProvinceID { get; set; }

        public Guid? DistrictID { get; set; }

        public Guid? WardID { get; set; }

        public string Description { get; set; }

        public int? SourceID { get; set; }

        public int? StatusID { get; set; }

        [StringLength(250)]
        public string StatusName { get; set; }

        public int? StatusReasonID { get; set; }

        [StringLength(250)]
        public string StatusReasonName { get; set; }

        public Guid? OwnerID { get; set; }

        [StringLength(250)]
        public string OwnerName { get; set; }

        public DateTime? QualifiedOn { get; set; }

        public Guid? QualifiedBy { get; set; }

        public Guid? ContactID { get; set; }

        public Guid? AccountID { get; set; }

        public Guid? OpportunityID { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }

        public bool? IsDelete { get; set; }
    }
}
