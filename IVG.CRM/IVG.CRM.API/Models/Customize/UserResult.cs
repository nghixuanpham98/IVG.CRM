using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IVG.CRM.API.Models.Customize
{
    public partial class UserResult
    {
        public Guid ID { get; set; }

        public Guid? DepartmentID { get; set; }

        public Guid? ManagerID { get; set; }

        [StringLength(50)]
        public string Username { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(250)]
        public string FirstName { get; set; }

        [StringLength(250)]
        public string LastName { get; set; }

        [StringLength(250)]
        public string FullName { get; set; }

        [StringLength(250)]
        public string Email { get; set; }

        [StringLength(50)]
        public string MobilePhone { get; set; }

        [StringLength(50)]
        public string MainPhone { get; set; }

        public int? Gender { get; set; }

        public DateTime? Birthday { get; set; }

        public Guid? WardID { get; set; }

        public Guid? DistrictID { get; set; }

        public Guid? ProvinceID { get; set; }

        public string Address { get; set; }

        [StringLength(250)]
        public string AvatarName { get; set; }

        [StringLength(250)]
        public string AvatarType { get; set; }

        public string AvatarBody { get; set; }

        public string Token { get; set; }

        public DateTime ExpiredIn { get; set; }

        [StringLength(250)]
        public string RoleName { get; set; }

        public int? RoleLevel { get; set; }
    }
}
