namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_ActivityTasks
    {
        public Guid ID { get; set; }

        public Guid? EntityID { get; set; }

        public Guid? OwnerID { get; set; }

        public string Subject { get; set; }

        public string Description { get; set; }

        public DateTime? Due { get; set; }

        public int? Priority { get; set; }

        public int? Status { get; set; }

        public DateTime? CompletedOn { get; set; }

        public Guid? CompletedBy { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
