namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_Opportunities
    {
        public Guid ID { get; set; }

        public Guid? LeadID { get; set; }

        [StringLength(500)]
        public string Topic { get; set; }

        public Guid? AccountID { get; set; }

        public Guid? ContactID { get; set; }

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

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
