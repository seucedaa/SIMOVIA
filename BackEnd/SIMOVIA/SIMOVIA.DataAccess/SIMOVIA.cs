using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using SIMOVIA.DataAccess.Context;

namespace SIMOVIA.DataAccess
{
    public class SIMOVIA : SIMOVIAContext
    {
        public static string ConnectionString { get; set; }

        public SIMOVIA()
        {
            ChangeTracker.LazyLoadingEnabled = false;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(ConnectionString);
            }

            base.OnConfiguring(optionsBuilder);
        }

        public static void BuildConnectionString(string connection)
        {
            var connectionStringBuilder = new SqlConnectionStringBuilder { ConnectionString = connection };
            ConnectionString = connectionStringBuilder.ConnectionString;
        }

    }
}
