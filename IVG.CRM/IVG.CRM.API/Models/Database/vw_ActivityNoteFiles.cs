namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_ActivityNoteFiles
    {
        public Guid ID { get; set; }

        public Guid? NoteID { get; set; }

        public string FileType { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
