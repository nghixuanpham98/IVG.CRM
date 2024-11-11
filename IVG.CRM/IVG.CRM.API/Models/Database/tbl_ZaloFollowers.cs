namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_ZaloFollowers
    {
        public Guid ID { get; set; }

        [Key]
        [StringLength(50)]
        public string FollowerID { get; set; }

        [StringLength(50)]
        public string FollowerIDByApp { get; set; }

        [StringLength(250)]
        public string DisplayName { get; set; }

        public int? Gender { get; set; }

        public string AvatarDefaultApp { get; set; }

        public DateTime? BirthDate { get; set; }

        public bool? IsFollower { get; set; }

        public string LastMessage { get; set; }

        [StringLength(50)]
        public string TypeLastMessage { get; set; }

        [StringLength(50)]
        public string LastTimeMessage { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
