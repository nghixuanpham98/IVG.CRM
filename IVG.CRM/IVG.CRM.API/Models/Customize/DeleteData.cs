using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IVG.CRM.API.Controllers
{
    public partial class DeleteData
    {
        public List<Guid> ID { get; set; }
    }
}