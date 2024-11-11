using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace IVG.CRM.API.Models.Database
{
    public partial class DBContext : DbContext
    {
        public DBContext()
            : base("name=DBContext")
        {
        }

        #region -- Table --

        public virtual DbSet<tbl_AccountContacts> tbl_AccountContacts { get; set; }
        public virtual DbSet<tbl_Accounts> tbl_Accounts { get; set; }
        public virtual DbSet<tbl_ActivityNoteFiles> tbl_ActivityNoteFiles { get; set; }
        public virtual DbSet<tbl_ActivityNotes> tbl_ActivityNotes { get; set; }
        public virtual DbSet<tbl_ActivityTasks> tbl_ActivityTasks { get; set; }
        public virtual DbSet<tbl_Cases> tbl_Cases { get; set; }
        public virtual DbSet<tbl_Columns> tbl_Columns { get; set; }
        public virtual DbSet<tbl_ConfigCodes> tbl_ConfigCodes { get; set; }
        public virtual DbSet<tbl_ConfigTimeMinutes> tbl_ConfigTimeMinutes { get; set; }
        public virtual DbSet<tbl_Contacts> tbl_Contacts { get; set; }
        public virtual DbSet<tbl_ContractLines> tbl_ContractLines { get; set; }
        public virtual DbSet<tbl_Contracts> tbl_Contracts { get; set; }
        public virtual DbSet<tbl_DiscountListItems> tbl_DiscountListItems { get; set; }
        public virtual DbSet<tbl_DiscountLists> tbl_DiscountLists { get; set; }
        public virtual DbSet<tbl_Districts> tbl_Districts { get; set; }
        public virtual DbSet<tbl_Entities> tbl_Entities { get; set; }
        public virtual DbSet<tbl_EntityStatus> tbl_EntityStatus { get; set; }
        public virtual DbSet<tbl_EntityStatusReason> tbl_EntityStatusReason { get; set; }
        public virtual DbSet<tbl_Languages> tbl_Languages { get; set; }
        public virtual DbSet<tbl_Leads> tbl_Leads { get; set; }
        public virtual DbSet<tbl_Opportunities> tbl_Opportunities { get; set; }
        public virtual DbSet<tbl_OptionSet> tbl_OptionSet { get; set; }
        public virtual DbSet<tbl_OptionSetValue> tbl_OptionSetValue { get; set; }
        public virtual DbSet<tbl_PriceListItems> tbl_PriceListItems { get; set; }
        public virtual DbSet<tbl_PriceLists> tbl_PriceLists { get; set; }
        public virtual DbSet<tbl_ProductBundles> tbl_ProductBundles { get; set; }
        public virtual DbSet<tbl_ProductRelationships> tbl_ProductRelationships { get; set; }
        public virtual DbSet<tbl_Products> tbl_Products { get; set; }
        public virtual DbSet<tbl_Provinces> tbl_Provinces { get; set; }
        public virtual DbSet<tbl_RolePermissions> tbl_RolePermissions { get; set; }
        public virtual DbSet<tbl_Roles> tbl_Roles { get; set; }
        public virtual DbSet<tbl_Subjects> tbl_Subjects { get; set; }
        public virtual DbSet<tbl_UnitGroups> tbl_UnitGroups { get; set; }
        public virtual DbSet<tbl_Units> tbl_Units { get; set; }
        public virtual DbSet<tbl_UserLogs> tbl_UserLogs { get; set; }
        public virtual DbSet<tbl_UserRoles> tbl_UserRoles { get; set; }
        public virtual DbSet<tbl_Users> tbl_Users { get; set; }
        public virtual DbSet<tbl_Wards> tbl_Wards { get; set; }
        public virtual DbSet<tbl_ZaloMessageDetails> tbl_ZaloMessageDetails { get; set; }
        public virtual DbSet<tbl_ZaloMessages> tbl_ZaloMessages { get; set; }
        public virtual DbSet<tbl_ZaloOAInfo> tbl_ZaloOAInfo { get; set; }
        public virtual DbSet<tbl_ZaloSettings> tbl_ZaloSettings { get; set; }
        public virtual DbSet<tbl_ZaloSharedInfo> tbl_ZaloSharedInfo { get; set; }
        public virtual DbSet<tbl_ZaloTagsAndNotes> tbl_ZaloTagsAndNotes { get; set; }
        public virtual DbSet<tbl_ZaloUsers> tbl_ZaloUsers { get; set; }
        public virtual DbSet<tbl_ZaloWebhooks> tbl_ZaloWebhooks { get; set; }

        #endregion

        #region -- View --

        public virtual DbSet<vw_Accounts> vw_Accounts { get; set; }
        public virtual DbSet<vw_ActivityNoteFiles> vw_ActivityNoteFiles { get; set; }
        public virtual DbSet<vw_ActivityNotes> vw_ActivityNotes { get; set; }
        public virtual DbSet<vw_ActivityTasks> vw_ActivityTasks { get; set; }
        public virtual DbSet<vw_Cases> vw_Cases { get; set; }
        public virtual DbSet<vw_ConfigTimeMinutes> vw_ConfigTimeMinutes { get; set; }
        public virtual DbSet<vw_Contacts> vw_Contacts { get; set; }
        public virtual DbSet<vw_ContractLines> vw_ContractLines { get; set; }
        public virtual DbSet<vw_Contracts> vw_Contracts { get; set; }
        public virtual DbSet<vw_DiscountListItems> vw_DiscountListItems { get; set; }
        public virtual DbSet<vw_DiscountLists> vw_DiscountLists { get; set; }
        public virtual DbSet<vw_Districts> vw_Districts { get; set; }
        public virtual DbSet<vw_Languages> vw_Languages { get; set; }
        public virtual DbSet<vw_Leads> vw_Leads { get; set; }
        public virtual DbSet<vw_Opportunities> vw_Opportunities { get; set; }
        public virtual DbSet<vw_PriceListItems> vw_PriceListItems { get; set; }
        public virtual DbSet<vw_PriceLists> vw_PriceLists { get; set; }
        public virtual DbSet<vw_ProductBundles> vw_ProductBundles { get; set; }
        public virtual DbSet<vw_ProductRelationships> vw_ProductRelationships { get; set; }
        public virtual DbSet<vw_Products> vw_Products { get; set; }
        public virtual DbSet<vw_Provinces> vw_Provinces { get; set; }
        public virtual DbSet<vw_Subjects> vw_Subjects { get; set; }
        public virtual DbSet<vw_UnitGroups> vw_UnitGroups { get; set; }
        public virtual DbSet<vw_Units> vw_Units { get; set; }
        public virtual DbSet<vw_UserRoles> vw_UserRoles { get; set; }
        public virtual DbSet<vw_Users> vw_Users { get; set; }
        public virtual DbSet<vw_Wards> vw_Wards { get; set; }
        public virtual DbSet<vw_ZaloCheckUnReadMessages> vw_ZaloCheckUnReadMessages { get; set; }
        public virtual DbSet<vw_ZaloUsers> vw_ZaloUsers { get; set; }

        #endregion

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<tbl_ContractLines>()
                .Property(e => e.Rate)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_ContractLines>()
                .Property(e => e.TotalPrice)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_ContractLines>()
                .Property(e => e.Discount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_ContractLines>()
                .Property(e => e.TotalDiscount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_ContractLines>()
                .Property(e => e.Net)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_Contracts>()
                .Property(e => e.TotalPrice)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_Contracts>()
                .Property(e => e.TotalDiscount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_Contracts>()
                .Property(e => e.NetPrice)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_DiscountListItems>()
                .Property(e => e.Amount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_PriceListItems>()
                .Property(e => e.Amount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_ContractLines>()
                .Property(e => e.Rate)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_ContractLines>()
                .Property(e => e.TotalPrice)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_ContractLines>()
                .Property(e => e.Discount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_ContractLines>()
                .Property(e => e.TotalDiscount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_ContractLines>()
                .Property(e => e.Net)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_Contracts>()
                .Property(e => e.TotalPrice)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_Contracts>()
                .Property(e => e.TotalDiscount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_Contracts>()
                .Property(e => e.NetPrice)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_DiscountListItems>()
                .Property(e => e.Amount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<vw_PriceListItems>()
                .Property(e => e.Amount)
                .HasPrecision(18, 0);
        }
    }
}
