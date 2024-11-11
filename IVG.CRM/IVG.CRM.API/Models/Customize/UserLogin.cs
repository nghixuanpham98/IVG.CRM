using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IVG.CRM.API.Models.Customize
{
    public partial class UserLogin
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public string BrowserName { get; set; }

        public string BrowserVersion { get; set; }

        public string Device { get; set; }
    }
}