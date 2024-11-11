namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Opportunities
    {
        [Key]
        [Column(Order = 0)]
        public Guid OpportunityID { get; set; }

        public Guid? LeadID { get; set; }

        [StringLength(500)]
        public string Topic { get; set; }

        public Guid? AccountID { get; set; }

        [StringLength(500)]
        public string AccountName { get; set; }

        public Guid? ContactID { get; set; }

        [StringLength(1001)]
        public string ContactName { get; set; }

        public int? PurchaseTimeframeID { get; set; }

        public int? CurrencyID { get; set; }

        public double? BudgetAmount { get; set; }

        public int? PurchaseProcessID { get; set; }

        public string CurrentSituation { get; set; }

        public string CustomerNeed { get; set; }

        public string ProposedSolution { get; set; }

        public string Description { get; set; }

        public DateTime? EstimatedClosingDate { get; set; }

        public double? EstimatedRevenue { get; set; }

        public int? StatusID { get; set; }

        public int? StatusReasonID { get; set; }

        public Guid? OwnerID { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(501)]
        public string OwnerName { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(501)]
        public string CreatedByName { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(501)]
        public string ModifiedByName { get; set; }
    }
}
