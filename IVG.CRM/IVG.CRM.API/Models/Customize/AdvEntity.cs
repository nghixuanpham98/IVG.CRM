using IVG.CRM.API.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IVG.CRM.API.Models.Customize
{
    public class PagingEntity
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public int? TotalPages { get; set; }
        public int? TotalRecords { get; set; }

    }
    public class AttachFileEntity
    {
        public Guid ID { get; set; }

        public Guid? NoteID { get; set; }

        public string FileType { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }
        public string FileBase64 { get; set; }


    }
    public class AdvEntity
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public int? TotalPages { get; set; }
        public int? TotalRecords { get; set; }
        public string TableViewName { get; set; }
        public string Columns { get; set; } = "*";
        public string WhereClause { get; set; }
        public string OrderByColumn { get; set; } = "ID";
        public string OrderByDirection { get; set; } = "ASC";

        public bool IsQualifiedLead { get; set; } = false;
        public bool IsDisqualified { get; set; } = false;
        public bool IsReactive { get; set; } = false;
        public Guid? ID { get; set; }
        public Guid? AccountID { get; set; }
        public Guid? ContactID { get; set; }
        public int? IntID { get; set; }
        public List<Guid> ListGuidID { get; set; }
        public Guid? MyID { get; set; }
        public Guid? ProvinceID { get; set; }
        public Guid? DistrictID { get; set; }
        public Guid? ParentID { get; set; }
        public vw_Accounts Account { get; set; }
        public tbl_Leads Lead { get; set; }
        public vw_Contacts Contact { get; set; } 
        public vw_Opportunities Opportunity { get; set; } 
         
    } 
}