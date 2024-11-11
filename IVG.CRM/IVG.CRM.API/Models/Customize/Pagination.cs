using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json.Linq;

namespace IVG.CRM.API.Models.Customize
{
    public partial class Pagination
    {
        public int pageNumber { get; set; } = 1;

        public int pageSize { get; set; } = 10;

        public string keySearch { get; set; }

        public bool? isAll { get; set; }

        public Guid? id { get; set; }

        public Guid? accountID { get; set; }

        public Guid? parentID { get; set; }

        public int? type { get; set; } = 100; // Number set default for get all

        public string orderType { get; set; }

        public string orderName { get; set; }
    }
}
